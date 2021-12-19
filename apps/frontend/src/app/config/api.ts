export const api = {
  baseURL: '/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
      confirm: '/auth/confirm',
    },
    users: {
      me: '/users/me',
      register: '/users/register',
      confirm: '/users/confirm',
    },
  },
};
