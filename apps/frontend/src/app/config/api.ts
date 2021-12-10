export const api = {
  baseURL: '/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      refresh: '/auth/refresh',
      register: '/auth/register',
      logout: '/auth/logout',
    },
    user: {
      me: '/user/me',
    },
  },
};
