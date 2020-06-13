import {
  definePropertiesFromOptions,
  mapAttributes,
  optionJSON
} from "./attribute.mjs";

/**
 * @param {string} name
 * @param {Object} options
 *
 * @property {string} name
 */
export class NamedObject {
  /**
   * options
   */
  static get attributes() {
    return {
      /**
       * The description of the repository content.
       * @return {string}
       */
      description: {
        description: "human readable description"
      },

      /**
       * Unique id within the provider.
       * @return {string}
       */
      id: {},

      /**
       * Unique id.
       * @return {string}
       */
      uuid: {},

      /**
       * Avatar.
       * @return {string}
       */
      avatarURL: {}
    };
  }

  /**
   * Map attributes between external and internal representation
   * @return {Object}
   */
  static get attributeMapping() {
    return {};
  }

  constructor(name, options, additionaProperties) {
    definePropertiesFromOptions(
      this,
      mapAttributes(options, this.constructor.attributeMapping),
      {
        name: { value: name },
        ...additionaProperties
      }
    );
  }

  /**
   * Check for equality
   * @param {NamedObject} other
   * @return {boolean} true if names are equal
   */
  equals(other) {
    if (other === undefined) {
      return false;
    }

    return this.name === other.name;
  }

  get displayName() {
    return this.name;
  }

  toString() {
    return this.mame;
  }

  /**
   * Provide name and all defined attributes
   */
  toJSON() {
    return optionJSON(this, {
      name: this.name
    });
  }
}
