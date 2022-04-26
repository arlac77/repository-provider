import { optionJSON } from "./attribute.mjs";
import { BaseObject } from "./base-object.mjs";

/**
 * Object with a name.
 * @param {string} name
 * @param {Object} options
 * @param {Object} additionalProperties
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
   * Check for equality.
   * @param {NamedObject} other
   * @return {boolean} true if names are equal and have the same owner
   */
  equals(other) {
    return (
      super.equals(other) &&
      this.fullName === other.fullName &&
      this.provider.equals(other.provider)
    );
  }

  /**
   * Beautified name use for human displaying only.
   * @return {string} human readable name
   */
  get displayName() {
    return this.name;
  }

  /**
   * @return {string} name with owner name
   */
  get fullName() {
    return this.owner.name + "/" + this.name;
  }

  /**
   * @return {string} name
   */
  toString() {
    return this.name;
  }

  /**
   * Provide name and all defined attributes.
   */
  toJSON() {
    return optionJSON(this, {
      name: this.name
    });
  }
}
