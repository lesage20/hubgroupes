<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/authService'

// État pour gérer l'affichage du menu mobile
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

// Vérifier si l'utilisateur est authentifié
const isAuthenticated = computed(() => {
  return AuthService.isLoggedIn()
})

// Récupérer les informations de l'utilisateur
const user = computed(() => {
  return authStore.user
})

// Fonction pour obtenir les initiales de l'utilisateur
const getUserInitials = computed(() => {
  if (!user.value) return 'U';
  const firstName = user.value.firstName || '';
  const lastName = user.value.lastName || '';
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
})

// Fonction pour déconnexion
const logout = () => {
  AuthService.logout()
    .then(() => {
      router.push({ name: 'login' })
    })
    .catch(error => {
      console.error('Erreur lors de la déconnexion:', error)
      router.push({ name: 'login' })
    })
}

// Fonction pour basculer le menu utilisateur
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// Fermer le menu utilisateur si on clique ailleurs
const closeUserMenu = (event) => {
  if (!event.target.closest('.user-menu-container')) {
    isUserMenuOpen.value = false
  }
}

// Ajouter un écouteur d'événement pour fermer le menu utilisateur
const addClickListener = () => {
  document.addEventListener('click', closeUserMenu)
}

// Supprimer l'écouteur d'événement lors du démontage du composant
const removeClickListener = () => {
  document.removeEventListener('click', closeUserMenu)
}

// Ajouter et supprimer les écouteurs d'événements au montage et démontage du composant
onMounted(() => {
  addClickListener()
})

onUnmounted(() => {
  removeClickListener()
})
</script>

<template>
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <RouterLink to="/" class="text-indigo-600 font-bold text-xl">HubGroupes</RouterLink>
        </div>

        <!-- Navigation principale - visible sur desktop -->
        <div class="hidden sm:flex sm:items-center sm:space-x-4">
          <div class="flex items-center space-x-4 mr-4">
            <RouterLink to="/" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Accueil
            </RouterLink>
            <RouterLink v-if="isAuthenticated" to="/communities"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Communautés
            </RouterLink>
            <RouterLink v-if="isAuthenticated" to="/members"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Membres
            </RouterLink>
            <RouterLink v-if="isAuthenticated" to="/activities"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Activités
            </RouterLink>
            <RouterLink v-if="isAuthenticated" to="/messages"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Messages
            </RouterLink>
          </div>

          <!-- Boutons d'authentification - visible sur desktop -->
          <template v-if="!isAuthenticated">
            <RouterLink to="/login"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Connexion
            </RouterLink>
            <RouterLink to="/register"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Inscription
            </RouterLink>
          </template>

          <!-- Menu utilisateur - visible sur desktop -->
          <div v-else class="relative user-menu-container">
            <button @click.stop="toggleUserMenu"
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span class="sr-only">Ouvrir le menu utilisateur</span>
              <div v-if="user && user.avatar" class="h-8 w-8 rounded-full overflow-hidden">
                <img :src="user.avatar" alt="Avatar" class="h-full w-full object-cover" />
              </div>
              <div v-else
                class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {{ getUserInitials }}
              </div>
            </button>

            <!-- Dropdown menu -->
            <div v-show="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
              <RouterLink to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Profil
              </RouterLink>
              <RouterLink to="/messages"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Messages
              </RouterLink>
              <button @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <!-- Bouton menu mobile -->
        <div class="flex items-center sm:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path v-if="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <div :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <RouterLink to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
          Accueil
        </RouterLink>
        <RouterLink v-if="isAuthenticated" to="/communities"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
          Communautés
        </RouterLink>
        <RouterLink v-if="isAuthenticated" to="/members"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
          Membres
        </RouterLink>
        <RouterLink v-if="isAuthenticated" to="/activities"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
          Activités
        </RouterLink>
        <RouterLink v-if="isAuthenticated" to="/messages"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
          Messages
        </RouterLink>
      </div>

      <!-- Informations utilisateur - mobile -->
      <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div v-if="user && user.avatar" class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
            <img :src="user.avatar" alt="Avatar" class="h-full w-full object-cover" />
          </div>
          <div v-else
            class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
            {{ getUserInitials }}
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user ? `${user.firstName} ${user.lastName}` :
              'Utilisateur'
            }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user ? user.phone : '' }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <RouterLink to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
            Profil
          </RouterLink>
          <button @click="logout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Boutons d'authentification - mobile -->
      <template v-else>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="space-y-1">
            <RouterLink to="/login"
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
              Connexion
            </RouterLink>
            <RouterLink to="/register"
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
              Inscription
            </RouterLink>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>
