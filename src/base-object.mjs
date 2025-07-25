import {
  definePropertiesFromOptions,
  mapAttributes
} from "./attribute-extras.mjs";
import { description_attribute, id_attribute } from "pacc";

/**
 * Creates an instance of BaseObject.
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.description]
 * @param {Object} [additionalProperties]
 *
 * @property {string?} id
 * @property {string?} description
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
   * Attributes definitions.
   * @return {Object}
   */
  static attributes = {
    id: id_attribute,
    description: description_attribute
  };

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
  static attributeMapping = {};

  /** @type {string} */ id;
  /** @type {string} */ description;

  /**
   * Creates an instance of BaseObject.
   * @param {Object} [options]
   * @param {string} [options.id]
   * @param {string} [options.description]
   * @param {Object} [additionalProperties]
   */
  constructor(options, additionalProperties) {
    this.updateAttributes(options, additionalProperties);
  }

  /**
   * Takes values from options.
   * @param {Object} [options]
   * @param {Object} [additionalProperties]
   */
  updateAttributes(options, additionalProperties) {
    definePropertiesFromOptions(
      this,
      // @ts-ignore
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
    return this.identifier;
  }

  /**
   * Complete name in the hierachy.
   * @return {string}
   */
  get fullName() {
    // @ts-ignore
    return this.name;
  }

  get identifier() {
    return this.fullName;
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
   * @param {BaseObject|undefined} other
   * @return {boolean} true if other is present
   */
  equals(other) {
    return other !== undefined;
  }
}
