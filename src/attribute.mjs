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
      if (object.hasOwnProperty(name)) {
        return;
      }

      let value = options[name];

      if (value === undefined) {
        if (typeof attribute === "object") {
          value = attribute.default;
        } else {
          value = attribute;
        }
      }

      if (value !== undefined) {
        if (properties[name] === undefined) {
          properties[name] = { value };
        } else {
          after[name] = value;
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
