export const amaNoUndefined = <T>(properties: T, property: keyof T) => {
  if (properties[property] === undefined) {
    console.error(`AMA: Please specify the "${property}" property`);

    throw new Error(`AMA: The property "${property}" cannot be UNDEFINED`);
  }
};
