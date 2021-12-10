export class ROUTES {
  static login = '/login';
  static register = `/register`;

  private static _dashboardRoute = (prefix = '/dashboard') => ({
    index: prefix,
    '*': `${prefix}/*`,
    me: '/me',
    users: '/users',
  });

  static get dashboardRoute(): ReturnType<typeof ROUTES._dashboardRoute> {
    return this._dashboardRoute();
  }
}
