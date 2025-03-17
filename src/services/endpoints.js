/**
 * Ce fichier contient toutes les URL des endpoints de l'API
 * Centraliser les URLs ici permet de les modifier facilement si nécessaire
 */

// URL de base de l'API
// Pour le développement local, utilisez http://localhost:3000/
// Pour la production, utilisez https://api.hubgroupes.com/
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

// Log pour vérifier l'URL de base
console.log('API Base URL configurée:', API_BASE_URL);

// Endpoints d'authentification
export const AUTH = {
  LOGIN: '/auth/sign-in',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/sign-out',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email'
};

// Endpoints des utilisateurs
export const USERS = {
  ME: '/users/me',
  PROFILE: (id) => `/user/${id}`,
  GET_ALL: '/users',
  GET_BY_ID: (id) => `/user/${id}`,
  UPDATE: (id) => `/user/${id}`,
  DELETE: (id) => `/user/${id}`,
  UPDATE_AVATAR: (id) => `/user/profile-picture`,
  CHANGE_PASSWORD: (id) => `/user/change-password`
};

// Endpoints des communautés
export const COMMUNITIES = {
  GET_ALL: '/communities/all',
  GET_MY_COMMUNITIES: '/communities/my-communities',
  GET_BY_ID: (id) => `/communities/${id}`,
  CREATE: '/communities',
  UPDATE: (id) => `/communities/${id}`,
  DELETE: (id) => `/communities/${id}`,
  GET_MEMBERS: (id) => `/communities/${id}/members/all`,
  ADD_MEMBER: (id) => `/communities/${id}/members`,
  REMOVE_MEMBER: (id, memberId) => `/communities/${id}/members/${memberId}`,
  UPDATE_COVER: (id) => `/communities/${id}/cover`
};

// Endpoints des activités
export const ACTIVITIES = {
  GET_ALL: '/activities',
  GET_BY_ID: (id) => `/activities/${id}`,
  CREATE: '/activities',
  UPDATE: (id) => `/activities/${id}`,
  DELETE: (id) => `/activities/${id}`,
  GET_PARTICIPANTS: (id) => `/activities/${id}/participants`,
  ADD_PARTICIPANT: (id) => `/activities/${id}/participants`,
  REMOVE_PARTICIPANT: (id, participantId) => `/activities/${id}/participants/${participantId}`,
  UPDATE_COVER: (id) => `/activities/${id}/cover`
};

// Endpoints des cotisations
export const CONTRIBUTIONS = {
  GET_ALL: '/contributions',
  GET_BY_ID: (id) => `/contributions/${id}`,
  CREATE: '/contributions',
  UPDATE: (id) => `/contributions/${id}`,
  DELETE: (id) => `/contributions/${id}`,
  PAY: (id) => `/contributions/${id}/pay`,
  GET_PAYMENTS: (id) => `/contributions/${id}/payments`
};

// Endpoints des messages
export const MESSAGES = {
  GET_ALL: '/messages',
  GET_BY_ID: (id) => `/messages/${id}`,
  CREATE: '/messages',
  UPDATE: (id) => `/messages/${id}`,
  DELETE: (id) => `/messages/${id}`,
  GET_CONVERSATION: (userId) => `/messages/conversation/${userId}`
};

// Endpoints des notifications
export const NOTIFICATIONS = {
  GET_ALL: '/notifications',
  GET_BY_ID: (id) => `/notifications/${id}`,
  MARK_AS_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: '/notifications/read-all',
  DELETE: (id) => `/notifications/${id}`
};
