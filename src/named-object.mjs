import { optionJSON } from "./attribute.mjs";
import { BaseObject } from "./base-object.mjs";
import { name_attribute, url_attribute, description_attribute, id_attribute } from "./attributes.mjs";

/**
 * Object with a name.
 * @param {string} name
 * @param {Object} options
 * @param {Object} additionalProperties
 *
 * @property {string} name
 */
export class NamedObject extends BaseObject {
  /**
   * options
   */
  static get attributes() {
    return {
      name: name_attribute,
      id: id_attribute,
      description: description_attribute,

      /**
       * The url of home page.
       * @return {string}
       */
      homePageURL: { ...url_attribute, writable: true }
    };
  }

  constructor(name, options, additionalProperties) {
    super(options, {
      name: { value: name },
      ...additionalProperties
    });
  }

  /**
   * Check for equality.
   * @param {NamedObject} other
   * @return {boolean} true if names are equal and have the same provider
   */
  equals(other) {
    return (
      super.equals(other) &&
      this.fullName === other.fullName &&
      this.provider.equals(other.provider)
    );
  }
  
  /**
   * Provided name and all defined attributes.
   */
  toJSON() {
    return optionJSON(this, {
      name: this.name
    });
  }
}
