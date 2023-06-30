import { setAttribute, getAttribute } from "./attribute.mjs";

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
 * @param {Object} [attributes] attribute meta info
 */
export function definePropertiesFromOptions(
  object,
  options = {},
  properties = {},
  attributes = object.constructor.attributes
) {
  const applyLater = {};

  if (attributes !== undefined) {
    Object.entries(attributes).forEach(([name, attribute]) => {
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

      const path = name.split(/\./);
      const first = path.shift();

      if (first !== undefined) {
        const property = properties[first];

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
      }
    });
  }

  Object.defineProperties(object, properties);
  Object.assign(object, applyLater);
}

/**
 * Get default values.
 * @param {Object} attributes
 * @param {Object} object
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
          a[c] = value instanceof Set ? [...value] : value;
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
 * @param {Object} [mapping]
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
