<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/authService'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const authStore = useAuthStore()

const userProfile = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  form: ''
})

const isLoading = ref(false)
const isPasswordLoading = ref(false)
const is2FALoading = ref(false)
const isAccessKeysLoading = ref(false)
const showSuccessAlert = ref(false)
const showPasswordSuccessAlert = ref(false)
const show2FASuccessAlert = ref(false)
const showAccessKeySuccessAlert = ref(false)
const activeTab = ref('profile')
const activeSecurityOption = ref('') // '', 'password', '2fa', 'access-keys'

// 2FA
const twoFactorMethod = ref('phone') // 'phone', 'email', 'totp'
const twoFactorEnabled = ref(false)
const twoFactorSetupStep = ref('initial') // 'initial', 'verification', 'success'
const twoFactorCode = ref('')
const twoFactorQRCode = ref('')
const twoFactorSecret = ref('')
const twoFactorRecoveryCodes = ref([])
const showRecoveryCodes = ref(false)

// Clés d'accès
const accessKeys = ref([])
const newAccessKeyName = ref('')
const newAccessKeyPassword = ref('')
const showNewAccessKeyForm = ref(false)
const newAccessKeyData = ref(null)
const showNewAccessKeyInfo = ref(false)

// Fonction pour initialiser les données du profil
const initializeProfile = async () => {
  try {
    const user = authStore.user
    
    if (user) {
      userProfile.first_name = user.first_name || ''
      userProfile.last_name = user.last_name || ''
      userProfile.email = user.email || ''
      userProfile.phone_number = user.phone_number || ''
      userProfile.bio = user.bio || ''
      
      // Vérifier si la 2FA est activée
      twoFactorEnabled.value = user.two_factor_enabled || false
      if (twoFactorEnabled.value) {
        twoFactorMethod.value = user.two_factor_method || 'phone'
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du profil:', error)
    errors.form = 'Une erreur est survenue lors du chargement de votre profil'
  }
}

// Appeler la fonction d'initialisation au montage du composant
onMounted(async () => {
  try {
    isLoading.value = true
    await initializeProfile()
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    errors.form = 'Une erreur est survenue lors du chargement de votre profil'
  } finally {
    isLoading.value = false
  }
})

watch(activeTab, async (newTab) => {
  if (newTab === 'profile') {
    // Do nothing
  }
})

const validateProfileForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.phone_number = ''
  errors.bio = ''
  errors.form = ''
  
  // Valider le prénom
  if (!userProfile.first_name) {
    errors.first_name = 'Le prénom est requis'
    isValid = false
  }
  
  // Valider le nom
  if (!userProfile.last_name) {
    errors.last_name = 'Le nom est requis'
    isValid = false
  }
  
  // Valider l'email
  if (!userProfile.email) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(userProfile.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }
  
  // Valider le téléphone (optionnel)
  if (userProfile.phone_number && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(userProfile.phone_number)) {
    errors.phone_number = 'Format de téléphone invalide'
    isValid = false
  }
  
  return isValid
}

const validatePasswordForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  errors.form = ''
  
  // Valider le mot de passe actuel
  if (!userProfile.currentPassword) {
    errors.currentPassword = 'Le mot de passe actuel est requis'
    isValid = false
  }
  
  // Valider le nouveau mot de passe
  if (!userProfile.newPassword) {
    errors.newPassword = 'Le nouveau mot de passe est requis'
    isValid = false
  } else if (userProfile.newPassword.length < 8) {
    errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }
  
  // Valider la confirmation du nouveau mot de passe
  if (!userProfile.confirmPassword) {
    errors.confirmPassword = 'Veuillez confirmer votre nouveau mot de passe'
    isValid = false
  } else if (userProfile.newPassword !== userProfile.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    isValid = false
  }
  
  return isValid
}

const updateProfile = async () => {
  if (!validateProfileForm()) return
  
  isLoading.value = true
  errors.form = ''
  
  try {
    await AuthService.updateProfile({
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      email: userProfile.email,
      phone_number: userProfile.phone_number,
      bio: userProfile.bio,
      username: userProfile.phone_number
    })
    
    showSuccessAlert.value = true
    
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de la mise à jour du profil'
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  if (!validatePasswordForm()) return
  
  isPasswordLoading.value = true
  errors.form = ''
  
  try {
    await AuthService.updatePassword({
      current_password: userProfile.currentPassword,
      new_password: userProfile.newPassword
    })
    
    userProfile.currentPassword = ''
    userProfile.newPassword = ''
    userProfile.confirmPassword = ''
    
    showPasswordSuccessAlert.value = true
    
    setTimeout(() => {
      showPasswordSuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de la mise à jour du mot de passe'
  } finally {
    isPasswordLoading.value = false
  }
}

// Fonctions pour la 2FA
const enable2FA = async () => {
  is2FALoading.value = true
  errors.form = ''
  
  try {
    // const response = await AuthService.enable2FA(twoFactorMethod.value)
    const response = await AuthService.enable2FA({ username: userProfile.phone_number})
    
    if (twoFactorMethod.value === 'totp') {
      // Pour TOTP, on reçoit un QR code et un secret
      twoFactorQRCode.value = response.data.data.qrCode
      twoFactorSecret.value = response.data.data.secret
    }
    
    twoFactorSetupStep.value = 'verification'
    show2FASuccessAlert.value = true
    setTimeout(() => {
      show2FASuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de l\'activation de la 2FA:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de l\'activation de la 2FA'
  } finally {
    is2FALoading.value = false
  }
}

const verify2FA = async () => {
  is2FALoading.value = true
  errors.form = ''
  
  try {
    const response = await AuthService.verify2FA(twoFactorCode.value, twoFactorMethod.value)
    
    twoFactorEnabled.value = true
    twoFactorSetupStep.value = 'success'
    
    // Récupérer les codes de récupération
    twoFactorRecoveryCodes.value = response.data.data.recoveryCodes || []
    showRecoveryCodes.value = true
    
    show2FASuccessAlert.value = true
    setTimeout(() => {
      show2FASuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la vérification du code 2FA:', error)
    errors.form = error?.message || 'Code invalide. Veuillez réessayer.'
  } finally {
    is2FALoading.value = false
  }
}

const disable2FA = async () => {
  is2FALoading.value = true
  errors.form = ''
  
  try {
    await AuthService.disable2FA(userProfile.currentPassword)
    
    twoFactorEnabled.value = false
    twoFactorSetupStep.value = 'initial'
    
    show2FASuccessAlert.value = true
    setTimeout(() => {
      show2FASuccessAlert.value = false
    }, 3000)
  } finally {
    is2FALoading.value = false
  }
}

// Fonctions pour les clés d'accès
const fetchAccessKeys = async () => {
  isAccessKeysLoading.value = true
  errors.form = ''
  
  try {
    const response = await AuthService.getAccessKeys()
    accessKeys.value = response.data.data.keys || []
  } catch (error) {
    console.error('Erreur lors de la récupération des clés d\'accès:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de la récupération des clés d\'accès'
  } finally {
    isAccessKeysLoading.value = false
  }
}

const createAccessKey = async () => {
  if (!newAccessKeyName.value || !newAccessKeyPassword.value) {
    errors.form = 'Veuillez remplir tous les champs'
    return
  }
  
  isAccessKeysLoading.value = true
  errors.form = ''
  
  try {
    const response = await AuthService.createAccessKey(newAccessKeyName.value, newAccessKeyPassword.value)
    
    // Stocker les informations de la nouvelle clé pour affichage
    newAccessKeyData.value = response.data.data.key
    showNewAccessKeyInfo.value = true
    
    // Réinitialiser le formulaire
    newAccessKeyName.value = ''
    newAccessKeyPassword.value = ''
    showNewAccessKeyForm.value = false
    
    // Rafraîchir la liste des clés
    await fetchAccessKeys()
    
    showAccessKeySuccessAlert.value = true
    setTimeout(() => {
      showAccessKeySuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la création de la clé d\'accès:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de la création de la clé d\'accès'
  } finally {
    isAccessKeysLoading.value = false
  }
}

const deleteAccessKey = async (keyId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette clé d\'accès ?')) {
    return
  }
  
  isAccessKeysLoading.value = true
  errors.form = ''
  
  try {
    await AuthService.deleteAccessKey(keyId, userProfile.currentPassword)
    
    // Rafraîchir la liste des clés
    await fetchAccessKeys()
    
    showAccessKeySuccessAlert.value = true
    setTimeout(() => {
      showAccessKeySuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la suppression de la clé d\'accès:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de la suppression de la clé d\'accès'
  } finally {
    isAccessKeysLoading.value = false
  }
}

// Fonction pour gérer les changements d'onglet
watch(activeTab, async (newTab) => {
  if (newTab === 'security') {
    activeSecurityOption.value = ''
  }
})

// Fonction pour changer d'option de sécurité
const setSecurityOption = (option) => {
  activeSecurityOption.value = option
  if (option === 'access-keys') {
    fetchAccessKeys()
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
    
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar avec photo de profil et navigation -->
      <div class="w-full md:w-1/4">
        <BaseCard>
          <div class="flex flex-col items-center">
            <div class="relative">
              <img
                :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=' + userProfile.first_name + '+' + userProfile.last_name + '&background=6366f1&color=fff'"
                alt="Photo de profil"
                class="h-32 w-32 rounded-full object-cover"
              />
              <button
                class="absolute bottom-0 right-0 rounded-full bg-indigo-500 p-1 text-white shadow-sm"
                title="Changer la photo de profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </button>
            </div>
            <h2 class="mt-4 text-xl font-semibold text-gray-900">{{ userProfile.first_name }} {{ userProfile.last_name }}</h2>
            <p class="text-sm text-gray-500">{{ userProfile.email }}</p>
          </div>
          
          <nav class="mt-6 space-y-1">
            <button
              @click="activeTab = 'profile'"
              :class="[
                'flex w-full items-center px-3 py-2 text-sm font-medium rounded-md',
                activeTab === 'profile'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Informations personnelles
            </button>
            
            <button
              @click="activeTab = 'security'"
              :class="[
                'flex w-full items-center px-3 py-2 text-sm font-medium rounded-md',
                activeTab === 'security'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Sécurité
            </button>
            
            <button
              @click="activeTab = 'notifications'"
              :class="[
                'flex w-full items-center px-3 py-2 text-sm font-medium rounded-md',
                activeTab === 'notifications'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              Notifications
            </button>
            
            <button
              @click="activeTab = 'billing'"
              :class="[
                'flex w-full items-center px-3 py-2 text-sm font-medium rounded-md',
                activeTab === 'billing'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              Facturation
            </button>
          </nav>
        </BaseCard>
      </div>
      
      <!-- Contenu principal -->
      <div class="w-full md:w-3/4">
        <!-- Informations personnelles -->
        <BaseCard v-if="activeTab === 'profile'" title="Informations personnelles">
          <BaseAlert
            v-if="showSuccessAlert"
            type="success"
            message="Votre profil a été mis à jour avec succès !"
            :dismissible="true"
          />
          
          <BaseAlert
            v-if="errors.form"
            type="error"
            :message="errors.form"
            :dismissible="true"
          />
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <BaseInput
                v-model="userProfile.first_name"
                label="Prénom"
                type="text"
                placeholder="Jean"
                :required="true"
                :error="errors.first_name"
              />
              
              <BaseInput
                v-model="userProfile.last_name"
                label="Nom"
                type="text"
                placeholder="Dupont"
                :required="true"
                :error="errors.last_name"
              />
            </div>
            
            <BaseInput
              v-model="userProfile.email"
              label="Email"
              type="email"
              placeholder="jean.dupont@example.com"
              :required="true"
              :error="errors.email"
            />
            
            <BaseInput
              v-model="userProfile.phone_number"
              label="Téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              :error="errors.phone_number"
            />
            
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <div class="mt-1">
                <textarea
                  id="bio"
                  v-model="userProfile.bio"
                  rows="4"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Parlez-nous de vous..."
                ></textarea>
              </div>
              <p v-if="errors.bio" class="mt-2 text-sm text-red-600">{{ errors.bio }}</p>
            </div>
            
            <div class="flex justify-end">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="isLoading"
              >
                Enregistrer les modifications
              </BaseButton>
            </div>
          </form>
        </BaseCard>
        
        <!-- Sécurité -->
        <BaseCard v-if="activeTab === 'security'" title="Sécurité">
          <div v-if="!activeSecurityOption" class="space-y-6">
            <!-- Liste des options de sécurité -->
            <ul class="divide-y divide-gray-200">
              <!-- Option Mot de passe -->
              <li 
                @click="setSecurityOption('password')" 
                class="py-4 px-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
              >
                <div class="flex items-center ">
                  <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <svg class="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
                    <p class="text-sm text-gray-500">Changer votre mot de passe pour sécuriser votre compte</p>
                  </div>
                </div>
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </li>
              
              <!-- Option 2FA -->
              <li 
                @click="setSecurityOption('2fa')" 
                class="py-4 px-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <svg class="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Authentification à deux facteurs</h3>
                    <p class="text-sm text-gray-500">
                      {{ twoFactorEnabled ? 'Activée - Ajoute une couche de sécurité supplémentaire' : 'Désactivée - Activez pour plus de sécurité' }}
                    </p>
                  </div>
                </div>
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </li>
              
              <!-- Option Clés d'accès -->
              <li 
                @click="setSecurityOption('access-keys')" 
                class="py-4 px-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <svg class="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Clés d'accès</h3>
                    <p class="text-sm text-gray-500">Gérez les clés d'accès pour les applications tierces</p>
                  </div>
                </div>
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </li>
            </ul>
          </div>
          
          <!-- Option Mot de passe -->
          <div v-else-if="activeSecurityOption === 'password'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Changer votre mot de passe</h3>
              <button
                @click="activeSecurityOption = ''"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Retour
              </button>
            </div>
            
            <BaseAlert
              v-if="showPasswordSuccessAlert"
              type="success"
              message="Votre mot de passe a été mis à jour avec succès !"
              :dismissible="true"
            />
            
            <form @submit.prevent="updatePassword" class="space-y-6">
              <BaseInput
                v-model="userProfile.currentPassword"
                label="Mot de passe actuel"
                type="password"
                placeholder="••••••••"
                :required="true"
                :error="errors.currentPassword"
              />
              
              <BaseInput
                v-model="userProfile.newPassword"
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                :required="true"
                :error="errors.newPassword"
              />
              
              <BaseInput
                v-model="userProfile.confirmPassword"
                label="Confirmer le nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                :required="true"
                :error="errors.confirmPassword"
              />
              
              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="isPasswordLoading"
                >
                  Mettre à jour le mot de passe
                </BaseButton>
              </div>
            </form>
          </div>
          
          <!-- Option 2FA -->
          <div v-else-if="activeSecurityOption === '2fa'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Authentification à deux facteurs</h3>
              <button
                @click="activeSecurityOption = ''"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Retour
              </button>
            </div>
            
            <BaseAlert
              v-if="show2FASuccessAlert"
              type="success"
              message="L'authentification à deux facteurs a été configurée avec succès !"
              :dismissible="true"
            />
            
            <div v-if="twoFactorSetupStep === 'initial'">
              <h3 class="text-lg font-medium text-gray-900">Méthode d'authentification à deux facteurs</h3>
              <p class="mt-1 text-sm text-gray-500">Choisissez une méthode d'authentification à deux facteurs pour renforcer la sécurité de votre compte.</p>
              <div class="mt-4 space-y-4">
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="phone"
                      name="two-factor-method"
                      type="radio"
                      value="phone"
                      v-model="twoFactorMethod"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="phone" class="font-medium text-gray-700">SMS</label>
                    <p class="text-gray-500">Recevez un code de vérification par SMS.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="email"
                      name="two-factor-method"
                      type="radio"
                      value="email"
                      v-model="twoFactorMethod"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="email" class="font-medium text-gray-700">Email</label>
                    <p class="text-gray-500">Recevez un code de vérification par email.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="totp"
                      name="two-factor-method"
                      type="radio"
                      value="totp"
                      v-model="twoFactorMethod"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="totp" class="font-medium text-gray-700">Authentificateur (TOTP)</label>
                    <p class="text-gray-500">Utilisez une application d'authentification pour générer un code de vérification.</p>
                  </div>
                </div>
              </div>
              <div class="flex justify-end mt-6">
                <BaseButton
                  @click="enable2FA"
                  variant="primary"
                  :loading="is2FALoading"
                >
                  Activer l'authentification à deux facteurs
                </BaseButton>
              </div>
            </div>
            
            <div v-else-if="twoFactorSetupStep === 'verification'">
              <h3 class="text-lg font-medium text-gray-900">Vérification de l'authentification à deux facteurs</h3>
              <p class="mt-1 text-sm text-gray-500">Veuillez entrer le code de vérification reçu pour activer l'authentification à deux facteurs.</p>
              <BaseInput
                v-model="twoFactorCode"
                label="Code de vérification"
                type="text"
                placeholder="••••••••"
                :required="true"
                :error="errors.form"
              />
              <div class="flex justify-end mt-6">
                <BaseButton
                  @click="verify2FA"
                  variant="primary"
                  :loading="is2FALoading"
                >
                  Vérifier le code
                </BaseButton>
              </div>
            </div>
            
            <div v-else-if="twoFactorSetupStep === 'success'">
              <h3 class="text-lg font-medium text-gray-900">Authentification à deux facteurs activée</h3>
              <p class="mt-1 text-sm text-gray-500">L'authentification à deux facteurs est maintenant activée pour votre compte.</p>
              <div class="flex justify-end mt-6">
                <BaseButton
                  @click="disable2FA"
                  variant="danger"
                  :loading="is2FALoading"
                >
                  Désactiver l'authentification à deux facteurs
                </BaseButton>
              </div>
            </div>
          </div>
          
          <!-- Option Clés d'accès -->
          <div v-else-if="activeSecurityOption === 'access-keys'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Clés d'accès</h3>
              <button
                @click="activeSecurityOption = ''"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Retour
              </button>
            </div>
            
            <BaseAlert
              v-if="showAccessKeySuccessAlert"
              type="success"
              message="La clé d'accès a été créée avec succès !"
              :dismissible="true"
            />
            
            <div v-if="showNewAccessKeyInfo">
              <h3 class="text-lg font-medium text-gray-900">Informations de la clé d'accès</h3>
              <p class="mt-1 text-sm text-gray-500">Voici les informations de la clé d'accès que vous venez de créer :</p>
              <div class="mt-4 p-4 bg-gray-50 rounded-md">
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Nom de la clé :</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ newAccessKeyData.name }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Clé d'accès :</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ newAccessKeyData.key }}</dd>
                  </div>
                </dl>
              </div>
              <p class="mt-2 text-sm text-red-600">Copiez cette clé maintenant. Vous ne pourrez plus la voir après avoir quitté cette page.</p>
              <div class="flex justify-end mt-6">
                <BaseButton
                  @click="showNewAccessKeyInfo = false"
                  variant="primary"
                >
                  J'ai copié ma clé
                </BaseButton>
              </div>
            </div>
            
            <div v-else>
              <div class="flex justify-end">
                <BaseButton
                  @click="showNewAccessKeyForm = true"
                  variant="primary"
                  v-if="!showNewAccessKeyForm"
                >
                  Créer une nouvelle clé d'accès
                </BaseButton>
              </div>
              
              <div v-if="showNewAccessKeyForm" class="mt-6">
                <h3 class="text-lg font-medium text-gray-900">Créer une nouvelle clé d'accès</h3>
                <p class="mt-1 text-sm text-gray-500">Veuillez remplir les informations pour créer une nouvelle clé d'accès :</p>
                <form @submit.prevent="createAccessKey" class="space-y-6 mt-4">
                  <BaseInput
                    v-model="newAccessKeyName"
                    label="Nom de la clé"
                    type="text"
                    placeholder="Ma clé d'accès"
                    :required="true"
                    :error="errors.form"
                  />
                  
                  <BaseInput
                    v-model="newAccessKeyPassword"
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    :required="true"
                    :error="errors.form"
                  />
                  
                  <div class="flex justify-end">
                    <BaseButton
                      type="button"
                      variant="secondary"
                      class="mr-3"
                      @click="showNewAccessKeyForm = false"
                    >
                      Annuler
                    </BaseButton>
                    <BaseButton
                      type="submit"
                      variant="primary"
                      :loading="isAccessKeysLoading"
                    >
                      Créer la clé d'accès
                    </BaseButton>
                  </div>
                </form>
              </div>
              
              <div v-if="accessKeys.length > 0" class="mt-6">
                <h3 class="text-lg font-medium text-gray-900">Liste des clés d'accès</h3>
                <ul class="mt-4 divide-y divide-gray-200">
                  <li v-for="(key, index) in accessKeys" :key="index" class="py-4 flex justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ key.name }}</p>
                      <p class="text-sm text-gray-500">Créée le {{ new Date(key.created_at).toLocaleDateString() }}</p>
                    </div>
                    <button
                      @click="deleteAccessKey(key.id)"
                      class="text-sm text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </li>
                </ul>
              </div>
              
              <div v-else-if="!isAccessKeysLoading && !showNewAccessKeyForm" class="mt-6">
                <p class="text-sm text-gray-500">Vous n'avez pas encore de clés d'accès.</p>
              </div>
            </div>
          </div>
          
          <BaseAlert
            v-if="errors.form"
            type="error"
            :message="errors.form"
            :dismissible="true"
          />
        </BaseCard>
        
        <!-- Notifications -->
        <BaseCard v-if="activeTab === 'notifications'" title="Notifications">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Notifications par email</h3>
              <p class="mt-1 text-sm text-gray-500">Choisissez les types de notifications que vous souhaitez recevoir par email.</p>
              
              <div class="mt-4 space-y-4">
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="comments" class="font-medium text-gray-700">Commentaires</label>
                    <p class="text-gray-500">Recevez une notification lorsque quelqu'un commente dans vos communautés.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="messages"
                      name="messages"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="messages" class="font-medium text-gray-700">Messages</label>
                    <p class="text-gray-500">Recevez une notification lorsque quelqu'un vous envoie un message.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="events"
                      name="events"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="events" class="font-medium text-gray-700">Événements</label>
                    <p class="text-gray-500">Recevez une notification pour les nouveaux événements dans vos communautés.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="newsletter"
                      name="newsletter"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="newsletter" class="font-medium text-gray-700">Newsletter</label>
                    <p class="text-gray-500">Recevez notre newsletter mensuelle avec les dernières actualités.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <BaseButton
                variant="primary"
              >
                Enregistrer les préférences
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Facturation -->
        <BaseCard v-if="activeTab === 'billing'" title="Facturation">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Plan actuel</h3>
              <div class="mt-4 bg-gray-50 p-4 rounded-md">
                <div class="flex justify-between items-center">
                  <div>
                    <h4 class="text-md font-medium text-gray-900">Plan Gratuit</h4>
                    <p class="text-sm text-gray-500">Accès aux fonctionnalités de base</p>
                  </div>
                  <BaseButton variant="outline">Mettre à niveau</BaseButton>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900">Historique de paiement</h3>
              <p class="mt-1 text-sm text-gray-500">Aucun paiement effectué pour le moment.</p>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900">Méthode de paiement</h3>
              <p class="mt-1 text-sm text-gray-500">Aucune méthode de paiement enregistrée.</p>
              <div class="mt-4">
                <BaseButton variant="outline">Ajouter une méthode de paiement</BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
