<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Membres</h1>
      <RouterLink 
        to="/members/invite" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Inviter un membre
      </RouterLink>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Sélection de communauté -->
    <div v-if="communities.length === 0 && !loading" class="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
      Vous n'êtes membre d'aucune communauté. Rejoignez une communauté pour voir ses membres.
    </div>

    <!-- Filtres et recherche -->
    <div v-if="communities.length > 0" class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Rechercher un membre..."
        />
      </div>
      <select 
        v-model="statusFilter" 
        class="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="pending">En attente</option>
        <option value="inactive">Inactifs</option>
      </select>
      <select 
        v-model="selectedCommunityId" 
        class="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        @change="loadCommunityMembers"
      >
        <option disabled value="">Sélectionner une communauté</option>
        <option v-for="community in communities" :key="community.id" :value="community.id">
          {{ community.label }}
        </option>
      </select>
    </div>

    <!-- Tableau des membres -->
    <div class="overflow-x-auto">
      <div v-if="loading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
      
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membre
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date d'inscription
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cotisation
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="paginatedMembers.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              Aucun membre trouvé
            </td>
          </tr>
          <tr v-for="member in paginatedMembers" :key="member.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="member.User?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.User?.first_name + ' ' + member.User?.last_name)" alt="" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ member.User?.first_name }} {{ member.User?.last_name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ member.User?.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  member.status === 'active' ? 'bg-green-100 text-green-800' : 
                  member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ getStatusText(member.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(member.register_date || member.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span 
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  member.subscription_status === 'paid' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ member.subscription_status === 'paid' ? 'À jour' : 'En retard' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewMember(member.id)" 
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Voir
              </button>
              <button 
                v-if="member.status === 'pending'"
                @click="validateMember(member.id)" 
                class="text-green-600 hover:text-green-900 mr-3"
              >
                Valider
              </button>
              <button 
                @click="removeMember(member.id)" 
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-700">
        Affichage de <span class="font-medium">{{ paginationStart }}</span> à <span class="font-medium">{{ paginationEnd }}</span> sur <span class="font-medium">{{ totalMembers }}</span> membres
      </div>
      <div class="flex space-x-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1" 
          :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          ]"
        >
          Précédent
        </button>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages" 
          :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          ]"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import MemberService from '@/services/memberService'
import CommunityService from '@/services/communityService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// État local
const searchQuery = ref('')
const statusFilter = ref('')
const selectedCommunityId = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const loading = ref(true)
const communities = ref([])
const members = ref([])
const error = ref(null)

// Récupération des données
onMounted(async () => {
  try {
    loading.value = true;
    
    // Charger toutes les communautés de l'utilisateur
    await fetchUserCommunities();
    
    // Sélectionner automatiquement une communauté
    await selectDefaultCommunity();
    
    // Charger les membres de la communauté sélectionnée
    if (selectedCommunityId.value) {
      await loadCommunityMembers();
    }
  } catch (err) {
    console.error('Erreur lors du chargement initial:', err);
    error.value = 'Erreur lors du chargement des données. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
})

// Charger les communautés de l'utilisateur
const fetchUserCommunities = async () => {
  try {
    // Utiliser le service communauté pour récupérer les communautés de l'utilisateur
    const userId = authStore.user?.id;
    const response = await CommunityService.getMyCommunities(userId);
    communities.value = response.data?.data?.communities || [];
  } catch (err) {
    console.error('Erreur lors du chargement des communautés:', err);
    error.value = 'Erreur lors du chargement des communautés.';
    communities.value = [];
  }
}

// Sélectionner une communauté par défaut
const selectDefaultCommunity = async () => {
  if (communities.value.length === 0) {
    selectedCommunityId.value = '';
    return;
  }
  
  // Récupérer l'utilisateur connecté
  const currentUser = authStore.user;
  
  // Chercher une communauté dont l'utilisateur est créateur
  const creatorCommunity = communities.value.find(
    community => community.creator_id === currentUser?.id || 
                community.owner_id === currentUser?.id
  );
  
  if (creatorCommunity) {
    // Si l'utilisateur est créateur d'une communauté, la sélectionner
    selectedCommunityId.value = creatorCommunity.id;
  } else {
    // Sinon, sélectionner la première communauté
    selectedCommunityId.value = communities.value[0]?.id || '';
  }
}

// Charger les membres de la communauté sélectionnée
const loadCommunityMembers = async () => {
  if (!selectedCommunityId.value) {
    members.value = [];
    return;
  }
  
  try {
    loading.value = true;
    error.value = null;
    
    // Utiliser le service membre pour récupérer les membres de la communauté
    const response = await MemberService.getMembers(selectedCommunityId.value);
    members.value = response.data?.data?.members || [];
    
    // Réinitialiser la pagination
    currentPage.value = 1;
  } catch (err) {
    console.error('Erreur lors du chargement des membres:', err);
    error.value = 'Erreur lors du chargement des membres.';
    members.value = [];
  } finally {
    loading.value = false;
  }
}

// Filtrer les membres en fonction des critères de recherche
const filteredMembers = computed(() => {
  if (!members.value.length) return [];
  
  return members.value.filter(member => {
    // Filtre par recherche
    const searchMatch = !searchQuery.value || 
      `${member.User?.first_name} ${member.User?.last_name}`.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      member.User?.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.User?.phone_number?.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Filtre par statut
    const statusMatch = statusFilter.value === '' || member.status === statusFilter.value;
    
    return searchMatch && statusMatch;
  });
});

// Pagination des membres filtrés
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMembers.value.slice(start, end);
});

// Computed properties
const totalMembers = computed(() => {
  return filteredMembers.value.length;
});

const totalPages = computed(() => Math.ceil(totalMembers.value / itemsPerPage.value) || 1);

const paginationStart = computed(() => {
  return Math.min((currentPage.value - 1) * itemsPerPage.value + 1, totalMembers.value);
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalMembers.value);
});

// Réinitialiser la pagination quand les filtres changent
watch([searchQuery, statusFilter, selectedCommunityId], () => {
  currentPage.value = 1;
});

// Méthodes
function getStatusText(status) {
  switch (status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'inactive': return 'Inactif'
    default: return status
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  } catch (err) {
    return 'Date invalide';
  }
}

function viewMember(memberId) {
  router.push(`/members/${memberId}`)
}

async function validateMember(memberId) {
  try {
    // Vérifier si le service a cette méthode, sinon utiliser une méthode appropriée
    if (typeof MemberService.validateMember === 'function') {
      await MemberService.validateMember(selectedCommunityId.value, memberId);
    } else {
      // Utiliser updateMember comme alternative
      await MemberService.updateMember(selectedCommunityId.value, memberId, { status: 'active' });
    }
    // Recharger les membres après la validation
    await loadCommunityMembers();
  } catch (error) {
    console.error('Erreur lors de la validation du membre:', error);
    alert('Erreur lors de la validation du membre');
  }
}

async function removeMember(memberId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
    try {
      await MemberService.removeMember(selectedCommunityId.value, memberId);
      // Recharger les membres après la suppression
      await loadCommunityMembers();
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      alert('Erreur lors de la suppression du membre');
    }
  }
}
</script>
