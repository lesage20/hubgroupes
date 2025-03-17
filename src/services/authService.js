import ApiService from './api';
import { AUTH } from './endpoints';

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
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response;
      });
  },

  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} userData - Les données de l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  register(userData) {
    return ApiService.post(AUTH.REGISTER, userData);
  },

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  logout() {
    return ApiService.post(AUTH.LOGOUT)
      .then(() => {
        localStorage.removeItem('token');
      });
  },

  /**
   * Rafraîchit le token d'authentification
   * @returns {Promise} - La promesse de la réponse
   */
  refreshToken() {
    return ApiService.post(AUTH.REFRESH_TOKEN)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response;
      });
  },

  /**
   * Demande la réinitialisation du mot de passe
   * @param {Object} data - Les données de la demande (email)
   * @returns {Promise} - La promesse de la réponse
   */
  forgotPassword(data) {
    return ApiService.post(AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Réinitialise le mot de passe
   * @param {Object} data - Les données de réinitialisation (token, nouveau mot de passe)
   * @returns {Promise} - La promesse de la réponse
   */
  resetPassword(data) {
    return ApiService.post(AUTH.RESET_PASSWORD, data);
  },

  /**
   * Vérifie l'email de l'utilisateur
   * @param {Object} data - Les données de vérification (token)
   * @returns {Promise} - La promesse de la réponse
   */
  verifyEmail(data) {
    return ApiService.post(AUTH.VERIFY_EMAIL, data);
  },

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean} - Vrai si l'utilisateur est connecté, faux sinon
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  /**
   * Récupère le token d'authentification
   * @returns {string|null} - Le token d'authentification ou null s'il n'existe pas
   */
  getToken() {
    return localStorage.getItem('token');
  }
};

export default AuthService;
