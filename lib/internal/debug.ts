import { log } from './logger';

export const amaNoUndefined = <T>(properties: T, property: keyof T) => {
  if (properties[property] === undefined) {
    log('PROPERTY_UNDEFINED', `The property "${property}" cannot be UNDEFINED`);
  }
};
