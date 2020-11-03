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
  const after = {};
  const attributes = object.constructor.attributes;
  if (attributes !== undefined) {
    Object.entries(attributes).forEach(([name, attribute]) => {
      if (properties[name] !== undefined && properties[name].value) {
        return;
      }

      let value = options[name];
      if (value === undefined) {
        value = attribute.default;
      }

      if (value === undefined) {
        return;
      }

      if (attribute.set) {
        value = attribute.set(value);
      } else {
        switch (attribute.type) {
          case "boolean":
            value =
              value === 0 || value === "0" || value === false ? false : true;
            break;
        }
      }

      if (
        object.hasOwnProperty(name) ||
        name === "merged" // TODO hack
        /*|| object.constructor.prototype[name] !== undefined*/
      ) {
        after[name] = value;
        return;
      }

      const path = name.split(/\./);
      let key = path[0];

      if (properties[key] === undefined) {
        if (path.length === 1) {
          properties[key] = { value };
          return;
        }
        properties[key] = { value: {} };
      } else {
        if (path.length === 1) {
          after[name] = value;
          return;
        }
      }

      // TODO only 2 levels for now
      properties[key].value[path[1]] = value;

      /*
      for (let n = 0; n < path.length; n++) {
        key = path[n];

        if (parent[key] === undefined) {
          parent[key] = {};
        }
        parent = parent[key];
      }
     parent[key] = value;
*/
    });
  }

  Object.defineProperties(object, properties);
  Object.assign(object, after);
}

export function getAttribute(object, name) {
  let value = object;

  for (const p of name.split(/\./)) {
    value = value[p];
  }

  return value;
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

/**
 * Same as mapAttributes but with the inverse mapping
 * Filters out null, undefined and empty strings
 * @param {Object} object
 * @param {Object} mapping
 * @return {Object} keys renamed after mapping
 */
export function mapAttributesInverse(object, mapping) {
  return mapAttributes(object,Object.fromEntries(Object.entries(mapping).map((k,v)=>[v,k])));
}
