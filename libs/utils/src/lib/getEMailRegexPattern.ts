export const getEmailRegexPattern = (): RegExp =>
  new RegExp(/^((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,})$/);
