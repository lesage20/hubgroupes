<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/authService'

const isOpen = ref(true)
const router = useRouter()
const authStore = useAuthStore()

// Récupérer les informations de l'utilisateur
const user = computed(() => {
  return authStore.user
})

// Fonction pour obtenir les initiales de l'utilisateur
const getUserInitials = computed(() => {
  if (!user.value) return 'U';
  const firstName = user.value.first_name || '';
  const lastName = user.value.last_name || '';
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

// Fonction pour basculer la sidebar
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div :class="[isOpen ? 'w-64' : 'w-20', 'transition-width duration-300 ease-in-out bg-white shadow-md']">
      <div class="flex flex-col h-full">
        <!-- Logo et bouton toggle -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <RouterLink to="/" class="text-indigo-600 font-bold text-xl" v-show="isOpen">HubGroupes</RouterLink>
          <div v-show="!isOpen" class="mx-auto">
            <RouterLink to="/" class="text-indigo-600 font-bold text-2xl">H</RouterLink>
          </div>
          <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'" />
            </svg>
          </button>
        </div>

        <!-- Profil utilisateur -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center">
            <div v-if="user && user.avatar" class="h-10 w-10 rounded-full overflow-hidden">
              <img :src="user.avatar" alt="Avatar" class="h-full w-full object-cover" />
            </div>
            <div v-else
              class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {{ getUserInitials }}
            </div>
            <div v-if="isOpen" class="ml-3">
              <div class="text-sm font-medium text-gray-900">{{ user ? `${user.first_name} ${user.last_name}` :
                'Utilisateur' }}</div>
              <div class="text-xs text-gray-500">{{ user ? user.phone_number : '' }}</div>
            </div>
          </div>
        </div>

        <!-- Menu de navigation -->
        <nav class="flex-1 overflow-y-auto py-4">
          <div class="px-2 space-y-1">
            <RouterLink to="/communities" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
  $route.path.includes('/communities')
    ? 'text-indigo-600 bg-indigo-50'
    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="isOpen">Communautés</span>
            </RouterLink>

            <RouterLink to="/members" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/members')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span v-if="isOpen">Membres</span>
            </RouterLink>

            <RouterLink to="/activities" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/activities')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span v-if="isOpen">Activités</span>
            </RouterLink>

            <RouterLink to="/messages" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/messages')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span v-if="isOpen">Messages</span>
            </RouterLink>

            <RouterLink to="/subscriptions" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/subscriptions')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span v-if="isOpen">Abonnements</span>
            </RouterLink>

            <RouterLink to="/marketplace" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/marketplace')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span v-if="isOpen">Marketplace</span>
            </RouterLink>

            <RouterLink to="/announcements" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/announcements')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span v-if="isOpen">Annonces</span>
            </RouterLink>

            <RouterLink to="/contributions" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/contributions')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="isOpen">Cotisations</span>
            </RouterLink>

            <RouterLink to="/finances" class="flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
              $route.path.includes('/finances')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-if="isOpen">Finances</span>
            </RouterLink>
          </div>
        </nav>

        <!-- Pied de la sidebar -->
        <div class="p-4 border-t border-gray-200">
          <RouterLink to="/profile"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            :class="{ 'justify-center': !isOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" :class="{ 'mr-0': !isOpen }" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span v-if="isOpen">Profil</span>
            <span v-else class="sr-only">Profil</span>
          </RouterLink>

          <button @click="logout"
            class="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            :class="{ 'justify-center': !isOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" :class="{ 'mr-0': !isOpen }" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span v-if="isOpen">Déconnexion</span>
            <span v-else class="sr-only">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar'
}
</script>

<style scoped>
.transition-width {
  transition-property: width;
}
</style>
