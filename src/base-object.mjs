import { definePropertiesFromOptions, mapAttributes } from "./attribute.mjs";

/**
 * @param {Object} options
 * @param {Object} additionalProperties
 */
export class BaseObject {
  /**
   * Attributes definitions
   */
  static get attributes() {
    return {
      /**
       * The description of the repository content.
       * @return {string}
       */
      description: {
        type: "string",
        description: "human readable description",
        writable: true
      },

      /**
       * Unique id within the provider.
       * @return {string}
       */
      id: { type: "string" },

      /**
       * Unique id.
       * @return {string}
       */
      uuid: { type: "string" },

      /**
       * Avatar.
       * @return {string}
       */
      avatarURL: { type: "url" },

      /**
       * The url of home page.
       * @return {string}
       */
      homePageURL: { type: "url", writable: true }
    };
  }

  /**
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

  constructor(options, additionalProperties) {
    definePropertiesFromOptions(
      this,
      mapAttributes(options, this.constructor.attributeMapping),
      additionalProperties
    );
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
