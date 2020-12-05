import { optionJSON } from "./attribute.mjs";
import { BaseObject } from "./base-object.mjs";

/**
 * @param {string} name
 * @param {Object} options
 *
 * @property {string} name
 */
export class NamedObject extends BaseObject {
  constructor(name, options, additionalProperties) {
    super(options, {
      name: { value: name },
      ...additionalProperties
    });
  }

  /**
   * Check for equality
   * @param {NamedObject} other
   * @return {boolean} true if names are equal
   */
  equals(other) {
    return super.equals(other) && this.name === other.name;
  }

  get displayName() {
    return this.name;
  }

  toString() {
    return this.name;
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
