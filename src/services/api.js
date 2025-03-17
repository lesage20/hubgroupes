import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { useAuthStore } from '@/stores/auth';

/**
 * Configuration de l'instance Axios avec les paramètres par défaut
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 secondes
});

// Log pour vérifier l'URL de base
console.log('API Base URL:', API_BASE_URL);

/**
 * Intercepteur pour ajouter le token d'authentification à chaque requête
 */
apiClient.interceptors.request.use(
  (config) => {
    try {
      const authStore = useAuthStore();
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`Request to ${config.url} with auth token`);
      } else {
        console.log(`Request to ${config.url} without auth token`);
      }
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur pour gérer les erreurs de réponse
 * - Gère les erreurs 401 (non autorisé) en redirigeant vers la page de connexion
 * - Gère les erreurs 403 (interdit)
 * - Gère les erreurs 404 (non trouvé)
 * - Gère les erreurs 500 (erreur serveur)
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    // Log pour déboguer la structure de la réponse
    if (response.config.url.includes('/auth/')) {
      console.log('Auth response structure:', JSON.stringify(response.data));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      console.error(`Error ${status} from ${error.config?.url}:`, error.response.data);

      // Token expiré ou invalide
      if (status === 401) {
        try {
          // Supprimer le token et rediriger vers la page de connexion
          const authStore = useAuthStore();
          authStore.logout();
          console.log('User logged out due to 401 error');
          window.location.href = '/login';
        } catch (e) {
          console.error('Error during logout after 401:', e);
        }
      }

      // Afficher un message d'erreur approprié
      const errorMessage = error.response.data.message || 'Une erreur est survenue';
      console.error(`Erreur ${status}: ${errorMessage}`);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('No response received:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Request configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Service API pour effectuer des requêtes HTTP
 */
const ApiService = {
  /**
   * Effectue une requête GET
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} params - Les paramètres de la requête
   * @returns {Promise} - La promesse de la réponse
   */
  get(url, params = {}) {
    return apiClient.get(url, { params });
  },

  /**
   * Effectue une requête POST
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} data - Les données à envoyer
   * @returns {Promise} - La promesse de la réponse
   */
  post(url, data = {}) {
    return apiClient.post(url, data);
  },

  /**
   * Effectue une requête PUT
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} data - Les données à envoyer
   * @returns {Promise} - La promesse de la réponse
   */
  put(url, data = {}) {
    return apiClient.put(url, data);
  },

  /**
   * Effectue une requête PATCH
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} data - Les données à envoyer
   * @returns {Promise} - La promesse de la réponse
   */
  patch(url, data = {}) {
    return apiClient.patch(url, data);
  },

  /**
   * Effectue une requête DELETE
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} params - Les paramètres de la requête
   * @returns {Promise} - La promesse de la réponse
   */
  delete(url, params = {}) {
    return apiClient.delete(url, { params });
  },

  /**
   * Télécharge un fichier
   * @param {string} url - L'URL de l'endpoint
   * @param {Object} params - Les paramètres de la requête
   * @returns {Promise} - La promesse de la réponse
   */
  download(url, params = {}) {
    return apiClient.get(url, {
      params,
      responseType: 'blob'
    });
  },

  /**
   * Téléverse un fichier
   * @param {string} url - L'URL de l'endpoint
   * @param {FormData} formData - Les données du formulaire
   * @param {Function} onUploadProgress - Fonction de callback pour suivre la progression
   * @returns {Promise} - La promesse de la réponse
   */
  upload(url, formData, onUploadProgress = null) {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  }
};

export default ApiService;
