import { definePropertiesFromOptions, mapAttributes } from "./attribute.mjs";

/**
 * @param {Object} options
 * @param {Object} additionalProperties
 */
export class BaseObject {
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

      homePageURL: { type: "url" }
    };
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
