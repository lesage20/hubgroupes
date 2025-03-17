import ApiService from './api';
import { COMMUNITIES } from './endpoints';

/**
 * Service pour gérer les opérations liées aux communautés
 */
const CommunityService = {
  /**
   * Récupère toutes les communautés
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getAllCommunities(params = {}) {
    return ApiService.get(COMMUNITIES.GET_ALL, params);
  },

  /**
   * Récupère les communautés de l'utilisateur connecté
   * @param {string|number} userId - L'ID de l'utilisateur
   * @param {Object} params - Les paramètres de filtrage additionnels (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getMyCommunities(userId, params = {}) {
    return ApiService.post(COMMUNITIES.GET_MY_COMMUNITIES, { userId, ...params });
  },

  /**
   * Récupère une communauté par son ID
   * @param {string|number} id - L'ID de la communauté
   * @returns {Promise} - La promesse de la réponse
   */
  getCommunityById(id) {
    return ApiService.get(COMMUNITIES.GET_BY_ID(id));
  },

  /**
   * Crée une nouvelle communauté
   * @param {Object} communityData - Les données de la communauté
   * @returns {Promise} - La promesse de la réponse
   */
  createCommunity(communityData) {
    return ApiService.post(COMMUNITIES.CREATE, communityData);
  },

  /**
   * Met à jour une communauté
   * @param {string|number} id - L'ID de la communauté
   * @param {Object} communityData - Les nouvelles données de la communauté
   * @returns {Promise} - La promesse de la réponse
   */
  updateCommunity(id, communityData) {
    return ApiService.put(COMMUNITIES.UPDATE(id), communityData);
  },

  /**
   * Supprime une communauté
   * @param {string|number} id - L'ID de la communauté
   * @returns {Promise} - La promesse de la réponse
   */
  deleteCommunity(id) {
    return ApiService.delete(COMMUNITIES.DELETE(id));
  },

  /**
   * Récupère les membres d'une communauté
   * @param {string|number} id - L'ID de la communauté
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getCommunityMembers(id, params = {}) {
    return ApiService.get(COMMUNITIES.GET_MEMBERS(id), params);
  },

  /**
   * Ajoute un membre à une communauté
   * @param {string|number} id - L'ID de la communauté
   * @param {Object} memberData - Les données du membre à ajouter
   * @returns {Promise} - La promesse de la réponse
   */
  addCommunityMember(id, memberData) {
    return ApiService.post(COMMUNITIES.ADD_MEMBER(id), memberData);
  },

  /**
   * Supprime un membre d'une communauté
   * @param {string|number} id - L'ID de la communauté
   * @param {string|number} memberId - L'ID du membre à supprimer
   * @returns {Promise} - La promesse de la réponse
   */
  removeCommunityMember(id, memberId) {
    return ApiService.delete(COMMUNITIES.REMOVE_MEMBER(id, memberId));
  },

  /**
   * Met à jour l'image de couverture d'une communauté
   * @param {string|number} id - L'ID de la communauté
   * @param {File} file - Le fichier image de couverture
   * @returns {Promise} - La promesse de la réponse
   */
  updateCoverImage(id, file) {
    const formData = new FormData();
    formData.append('cover', file);
    
    return ApiService.upload(COMMUNITIES.UPDATE_COVER(id), formData, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Progression du téléversement: ${percentCompleted}%`);
    });
  }
};

export default CommunityService;
