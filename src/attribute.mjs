/**
 * Create properties from options and default options.
 * Already present properties (direct) are skipped.
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

      const path = name.split(/\./);
      const first = path.shift();

      let value = options[name];
      if (value === undefined) {
        value = attribute.default;
      }

      if (value === undefined) {
        if (path.length) {
          if (getAttribute(object, first) === undefined) {
            const slice = {};
            setAttribute(slice, path.join("."), undefined);
            properties[first] = { value: slice };
          }
        }
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
        attribute.writeable ||
        object.hasOwnProperty(name) ||
        name === "merged" // TODO hack
        /*|| object.constructor.prototype[name] !== undefined*/
      ) {
        after[name] = value;
        return;
      }

      if(path.length) {
        const slice = {};
        setAttribute(slice, path.join("."), value);
        properties[first] = { value: slice };
      }
      else {
        properties[first] = { value };
      }
    });
  }

  Object.defineProperties(object, properties);
  Object.assign(object, after);
}

/**
 * Set Object attribute.
 * @param {Object} object
 * @param {string} name
 * @param {any} value
 */
export function setAttribute(object, name, value) {
  const parts = name.split(/\./);
  const last = parts.pop();

  for (const p of parts) {
    if (object[p] === undefined) {
      object[p] = {};
    }
    object = object[p];
  }

  object[last] = value;
}

/**
 * Deliver attribute value.
 * @param {Object} object
 * @param {string} name
 * @returns {any} value associated with the given property name
 */
export function getAttribute(object, name) {
  let value = object;

  for (const p of name.split(/\./)) {
    value = value[p];
    if (value === undefined) {
      break;
    }
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
 * Filters out null, undefined and empty strings.
 * ```js
 * mapAttributes({a:1},{a:"a'"}) // {"a'": 1}
 * ```
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
 * Same as mapAttributes but with the inverse mapping.
 * Filters out null, undefined and empty strings
 * @param {Object} object
 * @param {Object} mapping
 * @return {Object} keys renamed after mapping
 */
export function mapAttributesInverse(object, mapping) {
  return mapping === undefined
    ? object
    : mapAttributes(
        object,
        Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k]))
      );
}
