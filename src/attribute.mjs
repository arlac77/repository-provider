/**
 * @typedef {Object} Attribute
 *
 * @property {string} type
 * @property {boolean} writable
 * @property {boolean} [private] should the value be shown
 * @property {string} [depends] name of an attribute we depend on
 * @property {string} description
 * @property {any} [default]  the default value
 * @property {Function} [set] set the value
 * @property {Function} [get] get the value can be used to calculate default values
 * @property {string|string[]} [env] environment variable use to provide the value
 */

/**
 * Create properties from options and default options.
 * Already present properties (direct) are skipped.
 * The attribute list from the class will be applied to the
 * options and merged with the given set of properties.
 * ```js
 * class aClass {
 *   static get attributes() {
 *     return { with_default: { default: 77 }};
 *   }
 * }
 *
 * definePropertiesFromOptions(new aClass());
 * // equivalent to
 * Object.definedProperties(new aClass(),{ with_default: { value: 77 }})
 * ```
 * @see Object.definedProperties()
 * @see Object.getOwnPropertyDescriptor()
 * @param {Object} object target object
 * @param {Object} options as passed to object constructor
 * @param {Object} properties object properties
 * @param {Object} attributes
 */
export function definePropertiesFromOptions(
  object,
  options = {},
  properties = {},
  attributes = object.constructor.attributes || []
) {
  const applyLater = {};

  Object.entries(attributes).forEach(([name, attribute]) => {
    const path = name.split(/\./);
    const first = path.shift();
    const property = properties[first];

    let value = getAttribute(options, name);

    if (value === undefined) {
      if (attribute.get) {
        value = attribute.get(attribute, object, properties);
      } else if (
        attribute.default !== undefined &&
        attribute.default !== getAttribute(object, name)
      ) {
        value = attribute.default;
      }
    }

    if (attribute.set) {
      value = attribute.set(value);
    } else {
      switch (attribute.type) {
        case "set":
          if (Array.isArray(value)) {
            value = new Set(value);
          }
          break;
        case "boolean":
          if (value !== undefined) {
            value =
              value === 0 || value === "0" || value === false ? false : true;
          }
          break;
      }
    }

    if (path.length) {
      const remaining = path.join(".");
      if (property) {
        setAttribute(property.value, remaining, value);
      } else {
        const slice = {};
        setAttribute(slice, remaining, value);
        properties[first] = { configurable: true, value: slice };
      }
    } else {
      if (value !== undefined) {
        const op = Object.getOwnPropertyDescriptor(
          object.constructor.prototype,
          first
        );

        if (op?.set || property?.set) {
          applyLater[first] = value;
        } else {
          properties[first] = Object.assign(
            { value, writable: attribute.writable },
            property
          );
        }
      }
    }
  });

  Object.defineProperties(object, properties);
  Object.assign(object, applyLater);
}

/**
 * Get default values.
 * @param {Object} attributes
 * @return {Object} filled with default values
 */
export function defaultValues(attributes, object) {
  return Object.fromEntries(
    Object.entries(attributes).reduce((a, c) => {
      const [name, attribute] = c;

      if (attribute.default !== undefined) {
        a.push([name, attribute.default]);
      } else if (attribute.get !== undefined) {
        const value = attribute.get(attribute, object);
        if (value !== undefined) {
          a.push([name, value]);
        }
      }

      return a;
    }, [])
  );
}

/**
 * Set Object attribute.
 * The name may be a property path like 'a.b.c'.
 * @param {Object} object
 * @param {string} name
 * @param {any} value
 */
export function setAttribute(object, name, value) {
  const parts = name.split(/\./);
  const last = parts.pop();

  for (const p of parts) {
    if (object[p] === undefined || typeof object[p] !== "object") {
      object[p] = {};
    }
    object = object[p];
  }

  object[last] = value;
}

/**
 * Deliver attribute value.
 * The name may be a property path like 'a.b.c'.
 * @param {Object} object
 * @param {string} name
 * @returns {any} value associated with the given property name
 */
export function getAttribute(object, name) {
  let value = object;

  if (value && value[name] !== undefined) {
    return value[name];
  }

  for (const p of name.split(/\./)) {
    if (value === undefined) {
      break;
    }
    value = value[p];
  }

  return value;
}

/**
 * Create json based on present options.
 * In other words only produce key value pairs if value is defined.
 * @param {Object} object
 * @param {Object} initial
 * @param {Object} attributes to operator on
 * @return {Object} initial + defined values
 */
export function optionJSON(
  object,
  initial = {},
  attributes = object.constructor.attributes
) {
  return attributes
    ? Object.keys(attributes).reduce((a, c) => {
        const value = object[c];
        if (value !== undefined && !(value instanceof Function)) {
          if (value instanceof Set) {
            a[c] = [...value];
          } else {
            a[c] = value;
          }
        }
        return a;
      }, initial)
    : initial;
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
  if (object !== undefined) {
    const o = {};

    for (const k of Object.keys(object)) {
      const v = getAttribute(object, k);
      if (v !== undefined && v !== null && v !== "") {
        setAttribute(o, mapping[k] || k, v);
      }
    }

    return o;
  }
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
