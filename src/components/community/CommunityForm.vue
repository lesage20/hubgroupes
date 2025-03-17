<script setup>
import { ref, reactive, onMounted } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseAlert from '@/components/common/BaseAlert.vue';
import TagInput from '@/components/common/TagInput.vue';
import CommunityService from '@/services/communityService';
import MemberService from '@/services/memberService';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const props = defineProps({
  community: {
    type: Object,
    default: () => ({
      label: '',
      short_description: '',
      whatsapp: '',
      type: [],
      status: 'active',
      category: 'GOLDEN',
      creator: '',
      moderator: ''
    })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['success', 'cancel']);

// Récupérer l'ID de l'utilisateur connecté
const userId = authStore.user?.id || '';

const formData = reactive({
  label: props.community.label || '',
  short_description: props.community.short_description || '',
  whatsapp: props.community.whatsapp || '',
  type: Array.isArray(props.community.type) ? [...props.community.type] :
    (props.community.type ? [props.community.type] : []),
  status: props.community.status || 'active',
  category: 'GOLDEN', // Champ invisible prérempli
  creator: props.community.creator || userId, // Champ invisible avec l'ID de l'utilisateur
  moderator: props.community.moderator || userId // Champ invisible avec l'ID de l'utilisateur
});

const isSubmitting = ref(false);
const error = ref(null);
const success = ref(null);

// Types de communauté suggérés
const communityTypeOptions = [
  'Religion',
  'ONG',
  'Association',
  'Club',
  'Entreprise',
  'École',
  'Université',
  'Famille',
  'Amis',
  'Sport',
  'Loisir',
  'Politique',
  'Culturel',
  'Professionnel'
];

const communityStatuses = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' }
];

const validateForm = () => {
  if (!formData.label.trim()) {
    error.value = 'Le nom de la communauté est requis';
    return false;
  }

  if (!formData.short_description.trim()) {
    error.value = 'La description de la communauté est requise';
    return false;
  }

  if (!formData.whatsapp.trim()) {
    error.value = 'Le numéro WhatsApp est requis';
    return false;
  }

  // Validation basique du format de numéro WhatsApp
  const whatsappRegex = /^\+?[0-9]{10,15}$/;
  if (!whatsappRegex.test(formData.whatsapp.replace(/\s/g, ''))) {
    error.value = 'Le format du numéro WhatsApp est invalide';
    return false;
  }

  if (formData.type.length === 0) {
    error.value = 'Au moins un type de communauté est requis';
    return false;
  }

  return true;
};

/**
 * Ajoute l'utilisateur comme membre modérateur de la communauté
 * @param {Object} community - Données de la communauté créée
 * @returns {Promise} - Promesse résolue après l'ajout du membre
 */
const addUserAsModerator = async (community) => {
  try {
    const memberData = {
      user_id: authStore.user.id,
      community_id: community.id,
      role: 'MODERATOR',
      status: 'active'
    };

    await MemberService.addMember(community.id, memberData);
    console.log('Utilisateur ajouté comme modérateur de la communauté');
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur comme modérateur:', err);
    // Ne pas bloquer le flux principal si cette opération échoue
  }
};

const handleSubmit = async () => {
  error.value = null;
  success.value = null;

  if (!validateForm()) {
    return;
  }

  if (!authStore.user || !authStore.user.id) {
    error.value = 'Vous devez être connecté pour créer une communauté';
    return;
  }

  isSubmitting.value = true;

  try {
    // S'assurer que les champs creator et moderator sont à jour avec l'ID de l'utilisateur connecté
    formData.creator = authStore.user.id;
    formData.moderator = authStore.user.id;

    const communityData = {
      ...formData,
      owner_id: authStore.user.id,
      // Convertir le tableau de types en chaîne si nécessaire pour l'API
      type: formData.type.join(',')
    };

    let response;

    if (props.isEdit) {
      response = await CommunityService.updateCommunity(props.community.id, communityData);
    } else {
      response = await CommunityService.createCommunity(communityData);

      // Après la création réussie de la communauté, ajouter l'utilisateur comme modérateur
      if (response && response.data && response.data.data) {
        await addUserAsModerator(response.data.data);
      }
    }

    success.value = props.isEdit
      ? 'La communauté a été mise à jour avec succès'
      : 'La communauté a été créée avec succès';

    emit('success', response.data.data);
  } catch (err) {
    console.error('Erreur lors de la création/modification de la communauté:', err);
    error.value = props.isEdit
      ? 'Erreur lors de la mise à jour de la communauté'
      : 'Erreur lors de la création de la communauté';
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};

// Formater le numéro WhatsApp
const formatWhatsApp = (value) => {
  // Supprimer tous les caractères non numériques sauf le +
  let formatted = value.replace(/[^\d+]/g, '');

  // S'assurer qu'il n'y a qu'un seul + au début
  if (formatted.startsWith('+')) {
    formatted = '+' + formatted.substring(1).replace(/\+/g, '');
  } else {
    formatted = formatted.replace(/\+/g, '');
  }

  formData.whatsapp = formatted;
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <BaseAlert v-if="error" type="error" :message="error" />
    <BaseAlert v-if="success" type="success" :message="success" />

    <div>
      <label for="label" class="block text-sm font-medium text-gray-700">Nom de la communauté <span
          class="text-red-500">*</span></label>
      <input type="text" id="label" v-model="formData.label"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Nom de votre communauté" required />
    </div>

    <div>
      <label for="short_description" class="block text-sm font-medium text-gray-700">Description brève <span
          class="text-red-500">*</span></label>
      <textarea id="short_description" v-model="formData.short_description" rows="3"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Décrivez brièvement votre communauté" required></textarea>
    </div>

    <div>
      <label for="whatsapp" class="block text-sm font-medium text-gray-700">Numéro WhatsApp <span
          class="text-red-500">*</span></label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <input type="text" id="whatsapp" v-model="formData.whatsapp" @input="formatWhatsApp(formData.whatsapp)"
          class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="+22500000000" required />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </div>
      <p class="mt-1 text-xs text-gray-500">Format: +22500000000 (avec l'indicatif du pays)</p>
    </div>

    <div>
      <label for="type" class="block text-sm font-medium text-gray-700">Types de communauté <span
          class="text-red-500">*</span></label>
      <TagInput v-model="formData.type" :options="communityTypeOptions" placeholder="Sélectionnez des types..."
        :allowNew="false" class="mt-1" />
      <p class="mt-1 text-xs text-gray-500">Sélectionnez un ou plusieurs types dans la liste</p>
    </div>

    <!-- <div>
      <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
      <select id="status" v-model="formData.status"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        <option v-for="status in communityStatuses" :key="status.id" :value="status.id">{{ status.name }}</option>
      </select>
    </div> -->

    <!-- Champs invisibles -->
    <input type="hidden" v-model="formData.category" />
    <input type="hidden" v-model="formData.creator" />
    <input type="hidden" v-model="formData.moderator" />

    <div class="flex justify-end space-x-3">
      <BaseButton type="button" variant="secondary" @click="handleCancel">
        Annuler
      </BaseButton>
      <BaseButton type="submit" variant="primary" :loading="isSubmitting">
        {{ props.isEdit ? 'Mettre à jour' : 'Créer' }}
      </BaseButton>
    </div>
  </form>
</template>
