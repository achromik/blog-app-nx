export const api = {
  baseURL: '/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      refresh: '/auth/refresh',
    },
    user: {
      me: 'user/me',
    },
  },
};
