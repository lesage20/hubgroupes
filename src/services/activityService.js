import ApiService from './api';
import { ACTIVITIES } from './endpoints';

/**
 * Service pour gérer les opérations liées aux activités
 */
const ActivityService = {
  /**
   * Récupère toutes les activités
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getAllActivities(params = {}) {
    return ApiService.get(ACTIVITIES.GET_ALL, params);
  },

  /**
   * Récupère les événements à venir d'une communauté
   * @param {string|number} communityId - L'ID de la communauté
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getCommunityUpcomingEvents(communityId, params = {}) {
    return ApiService.post(ACTIVITIES.GET_COMMUNITY_UPCOMING_EVENTS, { communityId: communityId, ...params });
  },

  /**
   * Récupère les événements passés d'une communauté
   * @param {string|number} communityId - L'ID de la communauté
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getCommunityPastEvents(communityId, params = {}) {
    return ApiService.post(ACTIVITIES.GET_COMMUNITY_PAST_EVENTS, { communityId: communityId, ...params });
  },

  /**
   * Récupère les événements à venir d'un utilisateur
   * @param {string|number} userId - L'ID de l'utilisateur
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getUserUpcomingEvents(userId, params = {}) {
    return ApiService.post(ACTIVITIES.GET_USER_UPCOMING_EVENTS, { userId: userId, ...params });
  },

  /**
   * Récupère les événements passés d'un utilisateur
   * @param {string|number} userId - L'ID de l'utilisateur
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getUserPastEvents(userId, params = {}) {
    return ApiService.post(ACTIVITIES.GET_USER_PAST_EVENTS, { userId: userId, ...params });
  },

  /**
   * Récupère une activité par son ID
   * @param {string|number} id - L'ID de l'activité
   * @returns {Promise} - La promesse de la réponse
   */
  getActivityById(id) {
    return ApiService.get(ACTIVITIES.GET_BY_ID(id));
  },

  /**
   * Crée une nouvelle activité
   * @param {Object} activityData - Les données de l'activité
   * @returns {Promise} - La promesse de la réponse
   */
  createActivity(activityData) {
    return ApiService.post(ACTIVITIES.CREATE, activityData);
  },

  /**
   * Met à jour une activité
   * @param {string|number} id - L'ID de l'activité
   * @param {Object} activityData - Les nouvelles données de l'activité
   * @returns {Promise} - La promesse de la réponse
   */
  updateActivity(id, activityData) {
    return ApiService.put(ACTIVITIES.UPDATE(id), activityData);
  },

  /**
   * Supprime une activité
   * @param {string|number} id - L'ID de l'activité
   * @returns {Promise} - La promesse de la réponse
   */
  deleteActivity(id) {
    return ApiService.delete(ACTIVITIES.DELETE(id));
  },

  /**
   * Récupère les participants d'une activité
   * @param {string|number} id - L'ID de l'activité
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getActivityParticipants(id, params = {}) {
    return ApiService.get(ACTIVITIES.GET_PARTICIPANTS(id), params);
  },

  /**
   * Ajoute un participant à une activité
   * @param {string|number} id - L'ID de l'activité
   * @param {Object} participantData - Les données du participant à ajouter
   * @returns {Promise} - La promesse de la réponse
   */
  addActivityParticipant(id, participantData) {
    return ApiService.post(ACTIVITIES.ADD_PARTICIPANT(id), participantData);
  },

  /**
   * Supprime un participant d'une activité
   * @param {string|number} id - L'ID de l'activité
   * @param {string|number} participantId - L'ID du participant à supprimer
   * @returns {Promise} - La promesse de la réponse
   */
  removeActivityParticipant(id, participantId) {
    return ApiService.delete(ACTIVITIES.REMOVE_PARTICIPANT(id, participantId));
  },

  /**
   * Met à jour l'image de couverture d'une activité
   * @param {string|number} id - L'ID de l'activité
   * @param {File} file - Le fichier image de couverture
   * @returns {Promise} - La promesse de la réponse
   */
  updateCoverImage(id, file) {
    const formData = new FormData();
    formData.append('cover', file);
    
    return ApiService.upload(ACTIVITIES.UPDATE_COVER(id), formData, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Progression du téléversement: ${percentCompleted}%`);
    });
  }
};

export default ActivityService;
