import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userProfile = computed(() => user.value)

  // Actions
  function setUser(userData) {
    user.value = userData
    // Persister l'utilisateur dans le localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function setToken(tokenValue) {
    token.value = tokenValue
    localStorage.setItem('token', tokenValue)
  }

  function clearError() {
    error.value = null
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post('/auth/login', credentials)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          user: {
            id: 1,
            name: 'Utilisateur Test',
            email: credentials.email,
            role: 'admin'
          },
          token: 'fake-jwt-token-' + Math.random().toString(36).substr(2)
        }
      }
      
      // Stockage des données
      setUser(response.data.user)
      setToken(response.data.token)
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Erreur lors de la connexion'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post('/auth/register', userData)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          user: {
            id: 1,
            name: userData.name,
            email: userData.email,
            role: 'member'
          },
          token: 'fake-jwt-token-' + Math.random().toString(36).substr(2)
        }
      }
      
      // Stockage des données
      setUser(response.data.user)
      setToken(response.data.token)
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'inscription'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchUserProfile() {
    if (!token.value) return null
    
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get('/auth/me')
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          user: {
            id: 1,
            name: 'Utilisateur Test',
            email: 'test@example.com',
            role: 'admin',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            createdAt: '2025-01-01'
          }
        }
      }
      
      setUser(response.data.user)
      return response.data.user
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération du profil'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userProfile,
    
    // Actions
    login,
    register,
    logout,
    fetchUserProfile,
    clearError,
    setUser,
    setToken
  }
})
