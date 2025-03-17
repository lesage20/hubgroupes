import ApiService from './api';
import { AUTH, USERS } from './endpoints';
import { useAuthStore } from '@/stores/auth';

/**
 * Service pour gérer les opérations liées à l'authentification
 */
const AuthService = {
  /**
   * Connecte un utilisateur
   * @param {Object} credentials - Les identifiants de connexion (email, mot de passe)
   * @returns {Promise} - La promesse de la réponse
   */
  login(credentials) {
    return ApiService.post(AUTH.LOGIN, credentials)
      .then(response => {
        if (response.data && response.data.data && response.data.data.token) {
          const data = response.data.data
          const authStore = useAuthStore();
          authStore.setToken(data.token);
          console.log( { data })
          if (data.user) {
            authStore.setUser(data.user);
          }
        } else {
          console.error('Réponse de connexion invalide:', response);
        }
        return response;
      })
      .catch(error => {
        console.error('Erreur lors de la connexion:', error);
        throw error;
      });
  },

  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} userData - Les données de l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  register(userData) {
    console.log('Données d\'inscription:', userData);
    return ApiService.post(AUTH.REGISTER, userData)
      .then(response => {
        console.log('Réponse d\'inscription:', response.data);
        if (response.data && response.data.data && response.data.data.token) {
          const authStore = useAuthStore();
          authStore.setToken(response.data.data.token);
          if (response.data.data.user) {
            authStore.setUser(response.data.data.user);
          }
          console.log('Inscription réussie, token enregistré');
        } else {
          console.error('Réponse d\'inscription invalide:', response);
        }
        return response;
      })
      .catch(error => {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
      });
  },

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  logout() {
    const authStore = useAuthStore();
    return ApiService.post(AUTH.LOGOUT)
      .then(() => {
        authStore.logout();
        console.log('Déconnexion réussie');
      })
      .catch(error => {
        console.error('Erreur lors de la déconnexion:', error);
        // Même en cas d'erreur, on déconnecte l'utilisateur localement
        authStore.logout();
        throw error;
      });
  },

  /**
   * Rafraîchit le token d'authentification
   * @returns {Promise} - La promesse de la réponse
   */
  refreshToken() {
    return ApiService.post(AUTH.REFRESH_TOKEN)
      .then(response => {
        if (response.data && response.data.data && response.data.data.token) {
          const authStore = useAuthStore();
          authStore.setToken(response.data.data.token);
          console.log('Token rafraîchi avec succès');
        } else {
          console.error('Réponse de rafraîchissement de token invalide:', response);
        }
        return response;
      })
      .catch(error => {
        console.error('Erreur lors du rafraîchissement du token:', error);
        throw error;
      });
  },

  /**
   * Demande la réinitialisation du mot de passe
   * @param {Object} data - Les données de la demande (email)
   * @returns {Promise} - La promesse de la réponse
   */
  forgotPassword(data) {
    return ApiService.post(AUTH.FORGOT_PASSWORD, data)
      .catch(error => {
        console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
        throw error;
      });
  },

  /**
   * Réinitialise le mot de passe
   * @param {Object} data - Les données de réinitialisation (token, nouveau mot de passe)
   * @returns {Promise} - La promesse de la réponse
   */
  resetPassword(data) {
    return ApiService.post(AUTH.RESET_PASSWORD, data)
      .then(response => {
        if (response.data && response.data.data && response.data.data.token) {
          const authStore = useAuthStore();
          authStore.setToken(response.data.data.token);
          console.log('Mot de passe réinitialisé avec succès, token enregistré');
        } else {
          console.error('Réponse de réinitialisation du mot de passe invalide:', response);
        }
        return response;
      })
      .catch(error => {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
      });
  },

  /**
   * Vérifie l'email de l'utilisateur
   * @param {Object} data - Les données de vérification (token)
   * @returns {Promise} - La promesse de la réponse
   */
  verifyEmail(data) {
    return ApiService.post(AUTH.VERIFY_EMAIL, data)
      .then(response => {
        if (response.data && response.data.data && response.data.data.token) {
          const authStore = useAuthStore();
          authStore.setToken(response.data.data.token);
          console.log('Email vérifié avec succès, token enregistré');
        } else {
          console.error('Réponse de vérification de l\'email invalide:', response);
        }
        return response;
      })
      .catch(error => {
        console.error('Erreur lors de la vérification de l\'email:', error);
        throw error;
      });
  },

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean} - Vrai si l'utilisateur est connecté, faux sinon
   */
  isLoggedIn() {
    try {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return false;
    }
  },

  /**
   * Récupère le token d'authentification
   * @returns {string|null} - Le token d'authentification ou null s'il n'existe pas
   */
  getToken() {
    try {
      const authStore = useAuthStore();
      return authStore.token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  },

  /**
   * Récupère l'utilisateur connecté
   * @returns {Object|null} - L'utilisateur connecté ou null s'il n'existe pas
   */
  getUser() {
    try {
      const authStore = useAuthStore();
      return authStore.user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  /**
   * Récupère le profil de l'utilisateur depuis l'API en utilisant l'endpoint ME
   * @returns {Promise} - La promesse de la réponse
   */
  fetchCurrentUserProfile() {
    console.log('Récupération du profil utilisateur courant...');
    return ApiService.get(USERS.ME)
      .then(response => {
        console.log('Profil utilisateur courant récupéré:', response.data);
        if (response.data && response.data.data && response.data.data.user) {
          const authStore = useAuthStore();
          authStore.setUser(response.data.data.user);
          console.log('Profil utilisateur courant mis à jour dans le store');
          return response.data.data.user;
        } else {
          console.error('Réponse de profil utilisateur courant invalide:', response);
          throw new Error('Réponse de profil utilisateur courant invalide');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du profil utilisateur courant:', error);
        throw error;
      });
  },

  /**
   * Récupère le profil de l'utilisateur depuis l'API
   * @returns {Promise} - La promesse de la réponse
   */
  fetchUserProfile() {
    console.log('Récupération du profil utilisateur...');
    // Récupérer l'ID utilisateur depuis le store
    const authStore = useAuthStore();
    const userId = authStore.user?.id || authStore.user?._id;
    
    if (!userId) {
      console.error('Impossible de récupérer le profil utilisateur: ID utilisateur non disponible');
      return Promise.reject(new Error('ID utilisateur non disponible'));
    }
    
    console.log('Récupération du profil utilisateur avec ID:', userId);
    return ApiService.get(USERS.GET_BY_ID(userId))
      .then(response => {
        console.log('Profil utilisateur récupéré:', response.data);
        if (response.data && response.data.data && response.data.data.user) {
          authStore.setUser(response.data.data.user);
          console.log('Profil utilisateur mis à jour dans le store');
          return response.data.data.user;
        } else {
          console.error('Réponse de profil utilisateur invalide:', response);
          throw new Error('Réponse de profil utilisateur invalide');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        throw error;
      });
  },

  /**
   * Met à jour le profil de l'utilisateur
   * @param {Object} profileData - Les données du profil à mettre à jour
   * @returns {Promise} - La promesse de la réponse
   */
  updateProfile(profileData) {
    console.log('Mise à jour du profil utilisateur:', profileData);
    const authStore = useAuthStore();
    const userId = authStore.user?.id || authStore.user?._id;
    
    if (!userId) {
      console.error('Impossible de mettre à jour le profil: ID utilisateur non disponible');
      return Promise.reject(new Error('ID utilisateur non disponible'));
    }
    
    return ApiService.put(USERS.UPDATE(userId), profileData)
      .then(response => {
        console.log('Profil utilisateur mis à jour:', response.data);
        if (response.data && response.data.data && response.data.data.user) {
          authStore.setUser(response.data.data.user);
          console.log('Profil utilisateur mis à jour dans le store');
          return response.data.data.user;
        } else {
          console.error('Réponse de mise à jour du profil invalide:', response);
          throw new Error('Réponse de mise à jour du profil invalide');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        throw error;
      });
  },

  /**
   * Met à jour le mot de passe de l'utilisateur
   * @param {Object} passwordData - Les données du mot de passe (current_password, new_password)
   * @returns {Promise} - La promesse de la réponse
   */
  updatePassword(passwordData) {
    console.log('Mise à jour du mot de passe utilisateur');
    const authStore = useAuthStore();
    const userId = authStore.user?.id || authStore.user?._id;
    
    if (!userId) {
      console.error('Impossible de mettre à jour le mot de passe: ID utilisateur non disponible');
      return Promise.reject(new Error('ID utilisateur non disponible'));
    }
    
    return ApiService.put(USERS.CHANGE_PASSWORD(userId), passwordData)
      .then(response => {
        console.log('Mot de passe utilisateur mis à jour:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        throw error;
      });
  }
};

export default AuthService;
