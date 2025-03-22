import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import CommunityService from '@/services/communityService'
import { useAuthStore } from './auth'

export const useCommunityStore = defineStore('community', () => {
  // État
  const communities = ref([])
  const currentCommunity = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allCommunities = computed(() => communities.value)
  const activeCommunities = computed(() => 
    communities.value.filter(community => community.status === 'active')
  )
  const getCommunityById = computed(() => (id) => 
    communities.value.find(community => community.id === parseInt(id))
  )

  // Actions
  async function fetchCommunities() {
    loading.value = true
    error.value = null
    
    try {
      // Utiliser le service de communauté pour récupérer les vraies données
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      
      let response
      if (userId) {
        // Récupérer les communautés de l'utilisateur
        response = await CommunityService.getMyCommunities(userId)
      } else {
        // Récupérer toutes les communautés si l'utilisateur n'est pas connecté
        response = await CommunityService.getAllCommunities()
      }
      
      // Mettre à jour l'état avec les données reçues
      if (response && response.data && response.data.data && response.data.data.communities) {
        communities.value = response.data.data.communities
      } else {
        communities.value = []
        console.warn('Format de réponse inattendu:', response)
      }
      
      return communities.value
    } catch (err) {
      console.error('Erreur lors de la récupération des communautés:', err)
      error.value = err.message || 'Erreur lors de la récupération des communautés'
      communities.value = []
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function fetchCommunityById(id) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get(`/communities/${id}`)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          community: {
            id: parseInt(id),
            name: `Communauté ${id}`,
            description: `Description détaillée de la communauté ${id}`,
            status: 'active',
            memberCount: 45,
            createdAt: '2024-01-15',
            logo: `https://placehold.co/100x100?text=Com${id}`,
            address: '123 Rue Principale, Ville',
            email: `contact@communaute${id}.com`,
            phone: '+33 1 23 45 67 89',
            website: `https://communaute${id}.com`,
            socialLinks: {
              facebook: 'https://facebook.com',
              twitter: 'https://twitter.com',
              instagram: 'https://instagram.com'
            }
          }
        }
      }
      
      currentCommunity.value = response.data.community
      return response.data.community
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération de la communauté ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function createCommunity(communityData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post('/communities', communityData)
      
      // Pour la démo, on simule une réponse
      const newCommunity = {
        id: communities.value.length + 1,
        ...communityData,
        status: 'active',
        memberCount: 1,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      const response = {
        data: {
          community: newCommunity
        }
      }
      
      communities.value.push(response.data.community)
      return response.data.community
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de la communauté'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function updateCommunity(id, communityData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.put(`/communities/${id}`, communityData)
      
      // Pour la démo, on simule une mise à jour
      const index = communities.value.findIndex(c => c.id === parseInt(id))
      
      if (index !== -1) {
        const updatedCommunity = {
          ...communities.value[index],
          ...communityData
        }
        
        communities.value[index] = updatedCommunity
        
        if (currentCommunity.value && currentCommunity.value.id === parseInt(id)) {
          currentCommunity.value = updatedCommunity
        }
        
        return updatedCommunity
      }
      
      throw new Error('Communauté non trouvée')
    } catch (err) {
      error.value = err.message || `Erreur lors de la mise à jour de la communauté ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function deleteCommunity(id) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // await api.delete(`/communities/${id}`)
      
      // Pour la démo, on simule une suppression
      const index = communities.value.findIndex(c => c.id === parseInt(id))
      
      if (index !== -1) {
        communities.value.splice(index, 1)
        
        if (currentCommunity.value && currentCommunity.value.id === parseInt(id)) {
          currentCommunity.value = null
        }
        
        return true
      }
      
      throw new Error('Communauté non trouvée')
    } catch (err) {
      error.value = err.message || `Erreur lors de la suppression de la communauté ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  function clearCurrentCommunity() {
    currentCommunity.value = null
  }

  // Nouvelles méthodes pour récupérer les activités, discussions et annonces d'une communauté
  async function fetchCommunityActivities(communityId) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get(`/communities/${communityId}/activities`)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          activities: [
            {
              id: '1',
              title: 'Atelier Vue.js pour débutants',
              description: 'Un atelier pratique pour apprendre les bases de Vue.js et créer votre première application.',
              startDate: '2023-05-20T14:00:00Z',
              endDate: '2023-05-20T17:00:00Z',
              status: 'upcoming',
              participants: Array(12).fill(null).map((_, i) => ({ id: `p${i}` }))
            },
            {
              id: '2',
              title: 'Conférence sur les nouveautés de Vue 3',
              description: 'Découvrez les nouvelles fonctionnalités de Vue 3 et comment les utiliser dans vos projets.',
              startDate: '2023-04-15T10:00:00Z',
              endDate: '2023-04-15T12:00:00Z',
              status: 'completed',
              participants: Array(25).fill(null).map((_, i) => ({ id: `p${i}` }))
            }
          ]
        }
      }
      
      return response.data.activities
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération des activités de la communauté ${communityId}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function fetchCommunityDiscussions(communityId) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get(`/communities/${communityId}/discussions`)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          discussions: [
            {
              id: '1',
              title: 'Comment optimiser les performances de Vue.js ?',
              content: 'Je travaille sur une application Vue.js assez complexe et je rencontre des problèmes de performance. Quelles sont vos astuces pour optimiser une application Vue ?',
              createdAt: '2023-03-10T08:45:00Z',
              author: {
                id: '2',
                firstName: 'Marie',
                lastName: 'Martin',
                avatar: null
              },
              commentCount: 8,
              viewCount: 42
            },
            {
              id: '2',
              title: 'Partage : mon expérience avec Pinia vs Vuex',
              content: 'Après avoir utilisé Vuex pendant des années, j\'ai récemment migré vers Pinia. Voici mon retour d\'expérience et pourquoi je pense que Pinia est un meilleur choix pour la plupart des projets.',
              createdAt: '2023-02-28T15:20:00Z',
              author: {
                id: '1',
                firstName: 'Jean',
                lastName: 'Dupont',
                avatar: null
              },
              commentCount: 12,
              viewCount: 76
            }
          ]
        }
      }
      
      return response.data.discussions
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération des discussions de la communauté ${communityId}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function fetchCommunityAnnouncements(communityId) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get(`/communities/${communityId}/announcements`)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          announcements: [
            {
              id: '1',
              title: 'Nouveau projet communautaire',
              content: 'Nous lançons un nouveau projet communautaire pour créer une bibliothèque de composants Vue.js. Rejoignez-nous !',
              createdAt: '2023-04-10T11:00:00Z'
            },
            {
              id: '2',
              title: 'Mise à jour des règles de la communauté',
              content: 'Nous avons mis à jour les règles de la communauté pour améliorer la qualité des discussions. Veuillez les consulter.',
              createdAt: '2023-03-25T09:30:00Z'
            }
          ]
        }
      }
      
      return response.data.announcements
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération des annonces de la communauté ${communityId}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    communities,
    currentCommunity,
    loading,
    error,
    
    // Getters
    allCommunities,
    activeCommunities,
    getCommunityById,
    
    // Actions
    fetchCommunities,
    fetchCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    clearCurrentCommunity,
    fetchCommunityActivities,
    fetchCommunityDiscussions,
    fetchCommunityAnnouncements
  }
})
