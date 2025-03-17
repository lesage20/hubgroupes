/**
 * Ce fichier contient toutes les URL des endpoints de l'API
 * Centraliser les URLs ici permet de les modifier facilement si nécessaire
 */

// URL de base de l'API
export const API_BASE_URL = 'https://api.hubgroupes.com/api/v1';

// Endpoints d'authentification
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email'
};

// Endpoints des utilisateurs
export const USERS = {
  ME: '/users/me',
  GET_ALL: '/users',
  GET_BY_ID: (id) => `/users/${id}`,
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  UPDATE_AVATAR: (id) => `/users/${id}/avatar`,
  CHANGE_PASSWORD: (id) => `/users/${id}/change-password`
};

// Endpoints des communautés
export const COMMUNITIES = {
  GET_ALL: '/communities',
  GET_BY_ID: (id) => `/communities/${id}`,
  CREATE: '/communities',
  UPDATE: (id) => `/communities/${id}`,
  DELETE: (id) => `/communities/${id}`,
  GET_MEMBERS: (id) => `/communities/${id}/members`,
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
