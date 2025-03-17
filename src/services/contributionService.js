import ApiService from './api';
import { CONTRIBUTIONS } from './endpoints';

/**
 * Service pour gérer les opérations liées aux cotisations
 */
const ContributionService = {
  /**
   * Récupère toutes les cotisations
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getAllContributions(params = {}) {
    return ApiService.get(CONTRIBUTIONS.GET_ALL, params);
  },

  /**
   * Récupère une cotisation par son ID
   * @param {string|number} id - L'ID de la cotisation
   * @returns {Promise} - La promesse de la réponse
   */
  getContributionById(id) {
    return ApiService.get(CONTRIBUTIONS.GET_BY_ID(id));
  },

  /**
   * Crée une nouvelle cotisation
   * @param {Object} contributionData - Les données de la cotisation
   * @returns {Promise} - La promesse de la réponse
   */
  createContribution(contributionData) {
    return ApiService.post(CONTRIBUTIONS.CREATE, contributionData);
  },

  /**
   * Met à jour une cotisation
   * @param {string|number} id - L'ID de la cotisation
   * @param {Object} contributionData - Les nouvelles données de la cotisation
   * @returns {Promise} - La promesse de la réponse
   */
  updateContribution(id, contributionData) {
    return ApiService.put(CONTRIBUTIONS.UPDATE(id), contributionData);
  },

  /**
   * Supprime une cotisation
   * @param {string|number} id - L'ID de la cotisation
   * @returns {Promise} - La promesse de la réponse
   */
  deleteContribution(id) {
    return ApiService.delete(CONTRIBUTIONS.DELETE(id));
  },

  /**
   * Effectue le paiement d'une cotisation
   * @param {string|number} id - L'ID de la cotisation
   * @param {Object} paymentData - Les données du paiement
   * @returns {Promise} - La promesse de la réponse
   */
  payContribution(id, paymentData) {
    return ApiService.post(CONTRIBUTIONS.PAY(id), paymentData);
  },

  /**
   * Récupère les paiements d'une cotisation
   * @param {string|number} id - L'ID de la cotisation
   * @param {Object} params - Les paramètres de filtrage (pagination, tri, etc.)
   * @returns {Promise} - La promesse de la réponse
   */
  getContributionPayments(id, params = {}) {
    return ApiService.get(CONTRIBUTIONS.GET_PAYMENTS(id), params);
  }
};

export default ContributionService;
