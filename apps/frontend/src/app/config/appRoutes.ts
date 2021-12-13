export class AppRoutes {
  static login = '/login';
  static register = `/register`;
  static confirm = '/confirm/:confirmToken';

  private static _dashboardRoute = (prefix = '/dashboard') => ({
    index: prefix,
    '*': `${prefix}/*`,
    me: '/me',
    users: '/users',
  });

  static get dashboardRoute(): ReturnType<typeof AppRoutes._dashboardRoute> {
    return this._dashboardRoute();
  }
}
