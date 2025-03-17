import ApiService from './api';
import { USERS } from './endpoints';

/**
 * Service pour gérer les opérations liées aux utilisateurs
 */
const UserService = {
  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns {Promise} - La promesse de la réponse
   */
  getCurrentUser() {
    return ApiService.get(USERS.ME);
  },

  /**
   * Récupère tous les utilisateurs
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getAllUsers(params = {}) {
    return ApiService.get(USERS.GET_ALL, params);
  },

  /**
   * Récupère un utilisateur par son ID
   * @param {string|number} id - L'ID de l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  getUserById(id) {
    return ApiService.get(USERS.GET_BY_ID(id));
  },

  /**
   * Met à jour les informations d'un utilisateur
   * @param {string|number} id - L'ID de l'utilisateur
   * @param {Object} userData - Les nouvelles données de l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  updateUser(id, userData) {
    return ApiService.put(USERS.UPDATE(id), userData);
  },

  /**
   * Supprime un utilisateur
   * @param {string|number} id - L'ID de l'utilisateur
   * @returns {Promise} - La promesse de la réponse
   */
  deleteUser(id) {
    return ApiService.delete(USERS.DELETE(id));
  },

  /**
   * Met à jour l'avatar d'un utilisateur
   * @param {string|number} id - L'ID de l'utilisateur
   * @param {File} file - Le fichier image de l'avatar
   * @returns {Promise} - La promesse de la réponse
   */
  updateAvatar(id, file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return ApiService.upload(USERS.UPDATE_AVATAR(id), formData, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Progression du téléversement: ${percentCompleted}%`);
    });
  },

  /**
   * Change le mot de passe d'un utilisateur
   * @param {string|number} id - L'ID de l'utilisateur
   * @param {Object} passwordData - Les données du mot de passe (ancien et nouveau)
   * @returns {Promise} - La promesse de la réponse
   */
  changePassword(id, passwordData) {
    return ApiService.post(USERS.CHANGE_PASSWORD(id), passwordData);
  }
};

export default UserService;
