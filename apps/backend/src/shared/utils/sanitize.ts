export const sanitize = <T>(object: T, property: keyof T | Array<keyof T>) => {
  if (!Array.isArray(property)) {
    property = [property];
  }

  property.forEach((prop) => ((object[prop] as unknown) = undefined));
  return object as T;
};
