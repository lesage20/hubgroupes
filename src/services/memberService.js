import ApiService from './api';
import { COMMUNITIES } from './endpoints';

/**
 * Service pour gérer les membres des communautés
 */
class MemberService {
  /**
   * Récupère tous les membres d'une communauté
   * @param {string} communityId - ID de la communauté
   * @returns {Promise} - Promesse contenant les données des membres
   */
  getMembers(communityId) {
    return ApiService.post(COMMUNITIES.GET_MEMBERS, { communityId });
  }

  /**
   * Ajoute un membre à une communauté
   * @param {string} communityId - ID de la communauté
   * @param {Object} memberData - Données du membre à ajouter
   * @returns {Promise} - Promesse contenant les données du membre ajouté
   */
  addMember(communityId, memberData) {
    return ApiService.post(COMMUNITIES.ADD_MEMBER(communityId), memberData);
  }

  /**
   * Supprime un membre d'une communauté
   * @param {string} communityId - ID de la communauté
   * @param {string} memberId - ID du membre à supprimer
   * @returns {Promise} - Promesse contenant le résultat de la suppression
   */
  removeMember(communityId, memberId) {
    return ApiService.delete(COMMUNITIES.REMOVE_MEMBER(communityId, memberId));
  }
}

export default new MemberService();
