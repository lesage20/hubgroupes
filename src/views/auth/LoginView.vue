<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/authService'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const credentials = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: '',
  form: ''
})

const isLoading = ref(false)
const showSuccessAlert = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.username = ''
  errors.password = ''
  errors.form = ''
  
  // Valider le numéro de téléphone
  if (!credentials.username) {
    errors.username = 'Le numéro de téléphone est requis'
    isValid = false
  } else if (!/^(\+\d{1,3})?\d{9,10}$/.test(credentials.username.replace(/\s/g, ''))) {
    errors.username = 'Format de numéro de téléphone invalide'
    isValid = false
  }
  
  // Valider le mot de passe
  if (!credentials.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (credentials.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errors.form = ''
  
  try {
    // Utiliser le service d'authentification au lieu du store directement
    const response = await AuthService.login(credentials)
    console.log('Réponse de connexion reçue:', response)
    
    // Vérifier si la connexion a réussi
    if (response && response.data && response.data.data && response.data.data.token) {
      showSuccessAlert.value = true
      
      // Attendre un court instant pour montrer le message de succès
      setTimeout(() => {
        // Utiliser router.push avec un objet pour une navigation plus fiable
        router.push({ path: '/communities' })
      }, 1000)
    } else {
      errors.form = 'Réponse du serveur invalide'
    }
  } catch (error) {
    console.error('Erreur de connexion dans LoginView:', error)
    errors.form = error?.message || 'Une erreur est survenue lors de la connexion'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard padding="large" shadow="lg">
        <div class="sm:mx-auto sm:w-full sm:max-w-md mb-5">
          <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
            <span class="text-indigo-600">HubGroupes</span>
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <BaseAlert v-if="showSuccessAlert" type="success" message="Connexion réussie ! Redirection en cours..."
          :dismissible="false" :auto-close="true" />

        <BaseAlert v-if="errors.form" type="error" message="Identifiants incorrects. Veuillez réessayer."
          :dismissible="true" />

        <form class="space-y-4" @submit.prevent="handleLogin">
          <BaseInput v-model="credentials.username" label="Numéro de téléphone" type="tel"
            placeholder="+33 6 12 34 56 78" :required="true" :error="errors.username" />

          <BaseInput v-model="credentials.password" label="Mot de passe" type="password" placeholder="••••••••"
            :required="true" :error="errors.password" />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Mot de passe oublié ?</a>
            </div>
          </div>

          <div>
            <BaseButton type="submit" variant="primary" size="lg" :loading="isLoading" :full-width="true">
              Se connecter
            </BaseButton>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500 mb-2">
            Pas encore de compte ? <router-link :to="{ name: 'register' }"
              class="font-medium text-indigo-600 hover:text-indigo-500">Inscrivez-vous</router-link>
          </p>
          <p class="text-xs text-gray-500">
            &copy; 2025 HubGroupes - La plateforme de gestion de communautés
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
