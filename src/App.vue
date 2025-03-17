<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/authService'
import LandingLayout from './components/layout/LandingLayout.vue'
import AuthLayout from './components/layout/AuthLayout.vue'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()

// Initialiser les informations de l'utilisateur au démarrage de l'application
onMounted(async () => {
  // Si l'utilisateur est authentifié (token présent)
  if (authStore.isAuthenticated) {
    try {
      console.log('Récupération du profil utilisateur au démarrage')
      // Si l'utilisateur n'existe pas ou n'a pas d'ID, utiliser fetchCurrentUserProfile
      if (!authStore.user || (!authStore.user.id && !authStore.user._id)) {
        console.log('Utilisation de fetchCurrentUserProfile car pas d\'utilisateur ou pas d\'ID')
        await AuthService.fetchCurrentUserProfile()
      } else {
        // Sinon, utiliser fetchUserProfile avec l'ID
        console.log('Utilisation de fetchUserProfile avec ID:', authStore.user.id || authStore.user._id)
        await AuthService.fetchUserProfile()
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error)
      // Si une erreur se produit, déconnecter l'utilisateur
      authStore.logout()
    }
  }
})

// Déterminer quel layout utiliser en fonction de la route
const currentLayout = computed(() => {
  // Pages d'authentification
  if (route.name === 'login' || route.name === 'register') {
    return 'auth-layout'
  }
  
  // Page d'accueil
  if (route.path === '/') {
    return 'landing-layout'
  }
  
  // Toutes les autres pages (application)
  return 'app-layout'
})
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script>
export default {
  components: {
    'landing-layout': LandingLayout,
    'auth-layout': AuthLayout,
    'app-layout': AppLayout
  }
}
</script>
