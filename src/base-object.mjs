import { definePropertiesFromOptions, mapAttributes } from "./attribute-extras.mjs";
import { description_attribute, id_attribute } from "./attributes.mjs";
 
/**
 * @param {Object} options
 * @param {Object} additionalProperties
 */
export class BaseObject {
  /**
   * @return {string} type we represent
   */
  static get type() {
    return this.name.toLocaleLowerCase();
  }

  /**
   * ```
   * Tag -> tags
   * Repository -> repositories
   * ```
   * @return {string} name of the collection holding us in the owner
   */
  static get collectionName() {
    return this.type.toLocaleLowerCase() + "s";
  }

  /**
   * Attributes definitions
   * @return {Object}
   */
  static get attributes() {
    return {
      id: id_attribute,
      description: description_attribute
    };
  }

  /**
   * User modifyable attributes.
   * @return {Object} writable attributes
   */
  static get writableAttributes() {
    return Object.fromEntries(
      Object.entries(this.attributes).filter(([k, v]) => v.writable)
    );
  }

  /**
   * Map attributes between external and internal representation.
   * @return {Object}
   */
  static get attributeMapping() {
    return {};
  }

  /**
   * Creates an instance of BaseObject.
   * @param {Object} options
   * @param {Object} additionalProperties
   */
  constructor(options, additionalProperties) {
    this.updateAttributes(options, additionalProperties);
  }

  /**
   * Takes values from options.
   * @param {Object} options
   */
  updateAttributes(options, additionalProperties) {
    definePropertiesFromOptions(
      this,
      mapAttributes(options, this.constructor.attributeMapping),
      additionalProperties
    );
  }

  /**
   * Save object attributes in the backing store.
   */
  async update() {}

  /**
   * @return {string} fullName
   */
  toString() {
    return this.ifentifier;
  }

  /**
   * Beautified name use for human displaying only.
   * @return {string} human readable name
   */
  get displayName() {
    return this.name;
  }

  /**
   * Complete name in the hierachy.
   * @return {string}
   */
  get fullName() {
    return this.name;
  }

  get identifier() {
  	return this.name;
  }

  /**
   * Complete name in the hierachy.
   * @return {string}
   */
  get fullCondensedName() {
    return this.fullName;
  }

  get condensedName() {
    return this.name;
  }

  /**
   * By default cannot be written to.
   * @return {boolean} false
   */
  get isWritable() {
    return false;
  }

  /**
   * Check for equality
   * @param {BaseObject} other
   * @return {boolean} true if other is present
   */
  equals(other) {
    return other !== undefined;
  }
}
