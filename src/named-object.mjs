import { optionJSON } from "./attribute-extras.mjs";
import { BaseObject } from "./base-object.mjs";
import {
  name_attribute,
  description_attribute,
  id_attribute
} from "./attributes.mjs";

/**
 * Object with a name.
 * @param {string} name
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.name]
 * @param {string} [options.description]
 * @param {Object} [additionalProperties]
 *
 * @property {string} name
 */
export class NamedObject extends BaseObject {
  static get attributes() {
    return {
      id: id_attribute,
      name: name_attribute,
      description: description_attribute
    };
  }

  constructor(name, options, additionalProperties) {
    super(options, {
      name: { value: name },
      ...additionalProperties
    });
  }

  #name;

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  /**
   * Beautified name use for human displaying only.
   * @return {string} human readable name
   */
  get displayName() {
    return this.name;
  }

  /**
   * Name with default parts removed
   * @return {string}
   */
  get condensedName() {
    return this.name;
  }

  /**
   * Complete name in the hierachy.
   * @return {string}
   */
  get fullCondensedName() {
    return this.fullName;
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
      // @ts-ignore
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
