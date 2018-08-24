export function notImplementedError() {
  return new Error("not implemented");
}

export function propertiesFromOptions(properties, options, defaultOptions) {
  Object.keys(defaultOptions).forEach(name => {
    properties[name] = {
      value: (options !== undefined && options[name]) || defaultOptions[name]
    };
  });
}
