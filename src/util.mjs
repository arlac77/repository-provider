export function notImplementedError() {
  return new Error("not implemented");
}

export function asArray(value) {
  return Array.isArray(value) ? value : [value];
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
    const value =
      (options !== undefined && options[name]) || defaultOptions[name];

    if (value !== undefined) {
      if (properties[name] === undefined) {
        properties[name] = { value };
      } else {
        after[name] = value;
      }
    }
  });

  Object.defineProperties(object, properties);
  Object.assign(object, after);
}

/**
 * create json based on present options.
 * In other words only produce key value pairs if value is defined.
 * @param {Object} object
 * @param {Object} initial
 * @return {Object} initial + defined values
 */
export function optionJSON(object, initial = {}) {
  return Object.keys(object.constructor.defaultOptions).reduce((a, c) => {
    const value = object[c];
    if (value !== undefined && !(value instanceof Function)) {
      a[c] = value;
    }
    return a;
  }, initial);
}

/**
 * find a new branch name for a given pattern
 * '*' will be replaced by a number
 * 'something/*' will get to something/1 something/2 ...
 * @param {Repository} repository
 * @param {string} pattern
 */
export async function generateBranchName(repository, pattern) {
  let n = 1;

  //const present = new Set();

  for await (const b of repository.branches(pattern)) {
    //console.log("FOUND", b.name);
    //present.add(b.name);
    n++;
  }

  const name = pattern.replace(/\*/, n);
  return name;
}
