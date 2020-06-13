/**
 * Create properties from options and default options
 * Already present properties (direct) are skipped
 * @see Object.definedProperties()
 * @see Object.hasOwnProperty()
 * @param {Object} object target object
 * @param {Object} options as passed to object constructor
 * @param {Object} properties object properties
 */
export function definePropertiesFromOptions(
  object,
  options = {},
  properties = {}
) {
  const attributes = object.constructor.attributes;
  const after = {};
  if (attributes !== undefined) {
    Object.entries(attributes).forEach(([name, attribute]) => {

      // TODO can be removed later
      if (typeof attribute !== "object") {
        attribute = { default: attribute };
      }

      let value = options[name] || attribute.default;

      if (
        object.hasOwnProperty(name) ||
        name === "merged" // TODO hack
        /*|| object.constructor.prototype[name] !== undefined*/
      ) {
        after[name] = value;
        return;
      }

      if (value !== undefined) {
        const path = name.split(/\./);

        const p0 = path[0];

        if (properties[p0] === undefined) {
          if (path.length === 1) {
            if (attribute.set) {
              value = attribute.set(value);
            }
            properties[p0] = { value };
            return;
          }

          properties[p0] = { value: {} };
        } else {
          if (path.length === 1) {
            after[name] = value;
            return;
          }
        }

        let parent = properties[p0].value;

        for (let n = 1; n < path.length; n++) {
          const key = path[n];

          if (n === path.length - 1) {
            parent[key] = value;
          }
          if (parent[key] === undefined) {
            parent[key] = {};
          }
          parent = parent[key];
        }
      }
    });
  }

  Object.defineProperties(object, properties);
  Object.assign(object, after);
}

/**
 * Create json based on present options.
 * In other words only produce key value pairs if value is defined.
 * @param {Object} object
 * @param {Object} initial
 * @param {string[]} skip keys not to put in the result
 * @return {Object} initial + defined values
 */
export function optionJSON(object, initial = {}, skip = []) {
  return Object.keys(object.constructor.attributes || {})
    .filter(key => skip.indexOf(key) < 0)
    .reduce((a, c) => {
      const value = object[c];
      if (value !== undefined && !(value instanceof Function)) {
        a[c] = value;
      }
      return a;
    }, initial);
}

/**
 * Rename attributes.
 * Filters out null, undefined and empty strings
 * @param {Object} object
 * @param {Object} mapping
 * @return {Object} keys renamed after mapping
 */
export function mapAttributes(object, mapping) {
  return object === undefined
    ? undefined
    : Object.fromEntries(
        Object.entries(object)
          .filter(
            ([name, value]) =>
              value !== undefined && value !== null && value !== ""
          )
          .map(([name, value]) => [mapping[name] ? mapping[name] : name, value])
      );
}
