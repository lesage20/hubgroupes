<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Activités et Événements</h1>
      <RouterLink to="/activities/create"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
        Créer une activité
      </RouterLink>
    </div>

    <!-- Filtres et recherche -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <input v-model="searchQuery" type="text"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Rechercher une activité..." />
      </div>
      <select v-model="communityFilter"
        class="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
        <option value="all">Toutes les communautés</option>
        <option v-for="community in communities" :key="community.id" :value="community.label">
          {{ community.label || community.name }}
        </option>
      </select>
    </div>

    <!-- Onglets Activités à venir / Activités passées -->
    <div class="mb-6">
      <div class="flex border-b border-gray-200">
        <button @click="activeTab = 'upcoming'" :class="[
          'py-2 px-4 text-sm font-medium',
          activeTab === 'upcoming'
            ? 'border-b-2 border-indigo-500 text-indigo-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          Activités à venir
        </button>
        <button @click="activeTab = 'past'" :class="[
          'py-2 px-4 text-sm font-medium',
          activeTab === 'past'
            ? 'border-b-2 border-indigo-500 text-indigo-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          Activités passées
        </button>
      </div>
    </div>

    <!-- Liste des activités -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">Chargement des activités...</p>
      </div>
      <div v-else-if="filteredActivities.length === 0" class="text-center py-10">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune activité trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle activité.</p>
        <div class="mt-6">
          <RouterLink to="/activities/create"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>
            Créer une activité
          </RouterLink>
        </div>
      </div>
      <div v-else>
        <!-- Format tableau pour les activités -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Communauté
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>

                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="activity in paginatedActivities" :key="activity.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img v-if="activity.image" :src="activity.image" :alt="activity.title" class="h-10 w-10 rounded-full object-cover" />
                      <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ activity.title }}</div>
                      <div class="text-xs text-gray-500 line-clamp-1">{{ activity.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ activity.Community?.label }}</div>
                  <div class="text-xs text-gray-500 ">{{ activity.Community?.short_description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(activity.start_date) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(activity.end_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ activity.location }}</div>
                </td>
                

                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <RouterLink :to="`/activities/${activity.id}`" class="text-indigo-600 hover:text-indigo-900">
                      Détails
                    </RouterLink>
                    <RouterLink v-if="canEdit(activity)" :to="`/activities/${activity.id}/edit`" class="text-blue-600 hover:text-blue-900">
                      Modifier
                    </RouterLink>
                    <button v-if="canCancel(activity)" @click="cancelActivity(activity.id)" class="text-red-600 hover:text-red-900">
                      Annuler
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredActivities.length > 0" class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-700">
          Affichage de <span class="font-medium">{{ paginationStart }}</span> à <span class="font-medium">{{ paginationEnd }}</span> sur <span class="font-medium">{{ totalActivities }}</span> activités
        </div>
        <div class="flex space-x-2">
          <button @click="currentPage--" :disabled="currentPage === 1" :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          ]">
            Précédent
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          ]">
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import ActivityService from '@/services/activityService'
import CommunityService from '@/services/communityService'

const router = useRouter()
const activityStore = useActivityStore()
const communityStore = useCommunityStore()
const authStore = useAuthStore()

// État local
const activities = ref([])
const upcomingActivities = ref([])
const pastActivities = ref([])
const communities = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const communityFilter = ref('all')
const activeTab = ref('upcoming')
const currentPage = ref(1)
const itemsPerPage = ref(10)

onMounted(async () => {
  await Promise.all([
    fetchActivities(),
    fetchCommunities()
  ])
})

// Récupérer les activités de l'utilisateur
const fetchActivities = async () => {
  loading.value = true
  error.value = null

  try {
    const userId = authStore.user?.id
    if (!userId) {
      throw new Error('Utilisateur non connecté')
    }

    // Récupérer les événements à venir et passés de l'utilisateur
    const [upcomingResponse, pastResponse] = await Promise.all([
      ActivityService.getUserUpcomingEvents(userId),
      ActivityService.getUserPastEvents(userId)
    ])

    // Traiter les réponses
    upcomingActivities.value = upcomingResponse.data?.data?.activities || []
    pastActivities.value = pastResponse.data?.data?.activities || []

    // Combiner les activités
    activities.value = [
      ...upcomingActivities.value,
      ...pastActivities.value
    ]
  } catch (err) {
    console.error('Erreur lors du chargement des activités:', err)
    error.value = 'Erreur lors du chargement des activités'
    
    // Fallback pour le développement
    activities.value = await activityStore.fetchActivities()
  } finally {
    loading.value = false
  }
}

// Récupérer les communautés
const fetchCommunities = async () => {
  try {
    // Récupérer les communautés directement depuis l'API
    const response = await CommunityService.getMyCommunities(authStore.user?.id)
    if (response && response.data && response.data.data && response.data.data.communities) {
      communities.value = response.data.data.communities
      console.log('Communautés récupérées:', communities.value)
    } else {
      communities.value = []
      console.warn('Format de réponse inattendu pour les communautés:', response)
    }
  } catch (err) {
    console.error('Erreur lors du chargement des communautés:', err)
    communities.value = []
  }
}

// Filtrer les activités selon l'onglet actif
const filteredActivities = computed(() => {
  // Déterminer la source des activités en fonction de l'onglet actif
  const sourceActivities = activeTab.value === 'upcoming' 
    ? upcomingActivities.value 
    : pastActivities.value

  return sourceActivities.filter(activity => {
    // Filtre par recherche
    const matchesSearch = searchQuery.value === '' || 
      activity.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.location?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filtre par communauté
    const matchesCommunity = communityFilter.value === 'all' || 
      activity.Community?.label?.toString() === communityFilter.value
    
    return matchesSearch && matchesCommunity
  })
})

// Pagination
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActivities.value.slice(start, end)
})

const totalActivities = computed(() => filteredActivities.value.length)
const totalPages = computed(() => Math.ceil(totalActivities.value / itemsPerPage.value) || 1)
const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalActivities.value))

// Réinitialiser la pagination quand les filtres changent
watch([searchQuery, communityFilter, activeTab], () => {
  currentPage.value = 1
})

// Méthodes
function getCommunityName(communityId) {
  const community = communities.value.find(c => c.id === communityId)
  return community ? community.name : 'N/A'
}

function getStatusText(status) {
  switch (status) {
    case 'upcoming': return 'À venir'
    case 'ongoing': return 'En cours'
    case 'past': return 'Passée'
    case 'cancelled': return 'Annulée'
    default: return status
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'upcoming': return 'bg-blue-100 text-blue-800'
    case 'ongoing': return 'bg-green-100 text-green-800'
    case 'past': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getEventClass(status) {
  switch (status) {
    case 'upcoming': return 'bg-blue-100 text-blue-800'
    case 'ongoing': return 'bg-green-100 text-green-800'
    case 'past': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString) {
  try {
    // Vérifier si la date est valide
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'Date non disponible';
    }
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Erreur de formatage de date:', error, 'pour la valeur:', dateString);
    return 'Date non disponible';
  }
}

function canEdit(activity) {
  // Logique pour déterminer si l'utilisateur peut modifier l'activité
  return activity.status === 'upcoming' || activity.status === 'ongoing'
}

function canCancel(activity) {
  // Logique pour déterminer si l'utilisateur peut annuler l'activité
  return activity.status === 'upcoming' || activity.status === 'ongoing'
}

async function cancelActivity(activityId) {
  if (confirm('Êtes-vous sûr de vouloir annuler cette activité ?')) {
    try {
      await activityStore.cancelActivity(activityId)
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'activité:', error)
    }
  }
}

function viewActivity(activityId) {
  router.push(`/activities/${activityId}`)
}

function getEventsForDate(date) {
  // Filtrer les activités qui ont lieu à cette date
  return activities.value.filter(activity => {
    const startDate = new Date(activity.startDate)
    const endDate = new Date(activity.endDate)
    
    // Vérifier si la date est entre la date de début et la date de fin
    return (
      date.getFullYear() >= startDate.getFullYear() &&
      date.getMonth() >= startDate.getMonth() &&
      date.getDate() >= startDate.getDate() &&
      date.getFullYear() <= endDate.getFullYear() &&
      date.getMonth() <= endDate.getMonth() &&
      date.getDate() <= endDate.getDate()
    )
  })
}

function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
