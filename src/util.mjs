export function notImplementedError() {
  return new Error("not implemented");
}

/**
 * create properties from options and default options
 * @see Object.definedProperties()
 * @param {Object} properties where the properties will be stored
 * @param {Object} options
 * @param {Object} defaultOptions
 */
export function propertiesFromOptions(properties, options, defaultOptions) {
  Object.keys(defaultOptions).forEach(name => {
    properties[name] = {
      value: (options !== undefined && options[name]) || defaultOptions[name]
    };
  });
}
