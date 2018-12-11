export function notImplementedError() {
  return new Error("not implemented");
}

/**
 * create properties from options and default options
 * @see Object.definedProperties()
 * @param {Object} object target object
 * @param {Object} options as passed to object constructor
 * @param {Object} properties object properties
 */
export function definePropertiesFromOptions(object, options, properties = {}) {
  const defaultOptions = object.constructor.defaultOptions;
  const after = {};

  Object.keys(defaultOptions).forEach(name => {
    const value = (options !== undefined && options[name]) || defaultOptions[name];

    if(properties[name] === undefined) {
      properties[name] = { value };
    }
    else {
      after[name]=value;
    }
  });

  Object.defineProperties(object, properties);
  Object.assign(object,after);
}
