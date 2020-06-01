import { definePropertiesFromOptions, mapAttributes, optionJSON } from "./util.mjs";

/**
 * @property {string} name
 */
export class NamedObject {
  /**
   * options
   */
  static get defaultOptions() {
    return {
      /**
       * The description of the repository content.
       * @return {string}
       */
      description: undefined
    };
  }

  /**
   * Map attributes between external and internal representation
   */
  static get attributeMapping()
  {
    return {};
  }

  constructor( name, options, additionaProperties) {
    definePropertiesFromOptions(this, mapAttributes(options, this.constructor.attributeMapping), {
      name: { value: name },
      ...additionaProperties
    });
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

  displayName() {
    return this.mame;
  }

  toString() {
    return this.mame;
  }

  /**
   * Provide name and all defined defaultOptions
   */
  toJSON() {
    return optionJSON(this, {
      name: this.name
    });
  }
}
