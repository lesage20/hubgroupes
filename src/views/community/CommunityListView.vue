<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { useAuthStore } from '@/stores/auth'
import CommunityService from '@/services/communityService'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import CommunityForm from '@/components/community/CommunityForm.vue'

const router = useRouter()
const communityStore = useCommunityStore()
const authStore = useAuthStore()

const communities = ref([])
const isLoading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedFilter = ref('owner') // public, owner
const refreshing = ref(false)
const showCreateModal = ref(false)

// Filtres disponibles
const filters = [
  { id: 'public', name: 'Publiques' },
  { id: 'owner', name: 'Mes communautés' }
]

onMounted(async () => {
  await fetchCommunities()
})

const fetchCommunities = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Vérifier si l'utilisateur est connecté
    if (!authStore.user || !authStore.user.id) {
      console.error('Aucun utilisateur connecté ou ID utilisateur manquant')
      throw new Error('Utilisateur non connecté')
    }

    // Récupérer les communautés de l'utilisateur via le service
    const userId = authStore.user.id
    const response = await CommunityService.getMyCommunities(userId)

    if (response?.data?.data?.communities) {
      communities.value = response.data.data.communities.map(community => ({
        ...community,
        // isOwner: community.role === 'owner' || community.role === 'admin',
        isMember: true
      }))
    } else {
    // Fallback pour le développement
      communities.value = await communityStore.fetchCommunities()
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des communautés'
    console.error('Erreur lors du chargement des communautés:', err)

    // Fallback pour le développement
    try {
      communities.value = await communityStore.fetchCommunities()
    } catch (fallbackErr) {
      console.error('Erreur lors du chargement des communautés de fallback:', fallbackErr)
    }
  } finally {
    isLoading.value = false
    refreshing.value = false
  }
}

const refreshCommunities = async () => {
  if (refreshing.value || isLoading.value) return
  
  refreshing.value = true
  await fetchCommunities()
}

const filteredCommunities = computed(() => {
  let filtered = communities.value

  // Appliquer le filtre par type
  if (selectedFilter.value === 'owner') {
    filtered = filtered
  } else if (selectedFilter.value === 'public') {
    // Pour le moment, toutes les communautés sont considérées comme publiques
    // Aucun filtrage supplémentaire n'est nécessaire
  }

  // Appliquer la recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(community =>
      community.label.toLowerCase().includes(query) ||
      (community.short_description?.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Nombre total de communautés et nombre de communautés filtrées
const totalCount = computed(() => communities.value.length)
const filteredCount = computed(() => filteredCommunities.value.length)

const navigateToDetail = (communityId) => {
  router.push({ name: 'community-details', params: { id: communityId } })
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleCommunityCreated = async (newCommunity) => {
  // Fermer le modal
  closeCreateModal()
  
  // Rafraîchir la liste des communautés
  await fetchCommunities()
  
  // Optionnel : rediriger vers la page de détail de la nouvelle communauté
  if (newCommunity && newCommunity.id) {
    router.push({ name: 'community-details', params: { id: newCommunity.id } })
  }
}

const editCommunity = (communityId, event) => {
  event.stopPropagation()
  router.push({ name: 'community-edit', params: { id: communityId } })
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Communautés</h1>
        <p class="text-gray-600 mt-1">Découvrez et rejoignez des communautés ou créez la vôtre</p>
      </div>
      <div class="flex gap-2 mt-4 md:mt-0">
        <button @click="refreshCommunities"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="refreshing || isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" :class="{ 'animate-spin': refreshing }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rafraîchir
        </button>
        <BaseButton variant="primary" @click="openCreateModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
          Créer une communauté
        </BaseButton>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="w-full md:w-64">
        <label for="search" class="sr-only">Rechercher</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <input id="search" v-model="searchQuery" type="text" placeholder="Rechercher une communauté..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div class="flex space-x-2">
        <button v-for="filter in filters" :key="filter.id" @click="selectedFilter = filter.id"
          class="px-3 py-2 text-sm font-medium rounded-md"
          :class="selectedFilter === filter.id ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50'">
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- Compteur d'éléments -->
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm text-gray-700">
        <span v-if="!isLoading">
          <span class="font-medium">{{ filteredCount }}</span> communauté{{ filteredCount !== 1 ? 's' : '' }}
          <span v-if="filteredCount !== totalCount">(sur {{ totalCount }} au total)</span>
        </span>
        <span v-else>Chargement des communautés...</span>
      </div>
    </div>

    <!-- Message d'erreur -->
    <BaseAlert v-if="error" type="error" :message="error" />

    <!-- Chargement -->
    <div v-if="isLoading" class="flex justify-center my-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <!-- Liste vide -->
    <div v-else-if="filteredCommunities.length === 0" class="text-center my-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune communauté trouvée</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Commencez par créer une nouvelle communauté' }}
      </p>
      <div class="mt-6" v-if="!searchQuery">
        <BaseButton variant="primary" @click="openCreateModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
          Créer une communauté
        </BaseButton>
      </div>
    </div>

    <!-- Liste des communautés (format tableau) -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Communauté
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membres
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière activité
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="community in filteredCommunities" :key="community.id" class="hover:bg-gray-50 cursor-pointer"
              @click="navigateToDetail(community.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                    <img
                      :src="community.coverImage || community.logo || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'"
                      class="h-full w-full object-cover" alt="Couverture de la communauté" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ community.label }}</div>
                    <div class="text-xs text-gray-500 line-clamp-1 max-w-xs">{{ community.short_description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ community.type || 'Communauté' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ community.member_count || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="community.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ community.status === 'active' ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(community.updatedAt || community.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                <button v-if="community.isOwner" @click="editCommunity(community.id, $event)"
                  class="inline-flex items-center px-3 py-1.5 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
                <button @click="navigateToDetail(community.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création de communauté -->
    <BaseModal :show="showCreateModal" title="Créer une nouvelle communauté" size="lg" @close="closeCreateModal">
      <CommunityForm @success="handleCommunityCreated" @cancel="closeCreateModal" />
      <template #footer>
        <!-- Slot vide pour supprimer les boutons par défaut du modal -->
        <span></span>
      </template>
    </BaseModal>
  </div>
</template>
