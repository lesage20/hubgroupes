<script setup>
import { ref, reactive, onMounted } from 'vue'
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
  confirmNewPassword: ''
})

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  form: ''
})

const isLoading = ref(false)
const isPasswordLoading = ref(false)
const showSuccessAlert = ref(false)
const showPasswordSuccessAlert = ref(false)
const activeTab = ref('profile')

onMounted(async () => {
  try {
    console.log('Chargement du profil utilisateur...')
    const user = authStore.user
    
    if (user) {
      console.log('Données utilisateur récupérées:', user)
      userProfile.first_name = user.first_name || ''
      userProfile.last_name = user.last_name || ''
      userProfile.email = user.email || ''
      userProfile.phone_number = user.phone_number || ''
      userProfile.bio = user.bio || ''
    } else {
      console.log('Aucune donnée utilisateur disponible, récupération du profil...')
      try {
        await AuthService.fetchCurrentUserProfile()
        const updatedUser = authStore.user
        if (updatedUser) {
          userProfile.first_name = updatedUser.first_name || ''
          userProfile.last_name = updatedUser.last_name || ''
          userProfile.email = updatedUser.email || ''
          userProfile.phone_number = updatedUser.phone_number || ''
          userProfile.bio = updatedUser.bio || ''
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
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
  errors.confirmNewPassword = ''
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
  if (!userProfile.confirmNewPassword) {
    errors.confirmNewPassword = 'Veuillez confirmer votre nouveau mot de passe'
    isValid = false
  } else if (userProfile.newPassword !== userProfile.confirmNewPassword) {
    errors.confirmNewPassword = 'Les mots de passe ne correspondent pas'
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
    userProfile.confirmNewPassword = ''
    
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
                class="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-1 text-white shadow-sm"
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
          <BaseAlert
            v-if="showPasswordSuccessAlert"
            type="success"
            message="Votre mot de passe a été mis à jour avec succès !"
            :dismissible="true"
          />
          
          <BaseAlert
            v-if="errors.form"
            type="error"
            :message="errors.form"
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
            
            <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <BaseInput
                v-model="userProfile.newPassword"
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                :required="true"
                :error="errors.newPassword"
              />
              
              <BaseInput
                v-model="userProfile.confirmNewPassword"
                label="Confirmer le nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                :required="true"
                :error="errors.confirmNewPassword"
              />
            </div>
            
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
