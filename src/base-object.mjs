import { definePropertiesFromOptions, mapAttributes } from "./attribute.mjs";

/**
 * @param {Object} options
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
      avatarURL: {},

      homePageURL: {}
    };
  }

  /**
   * Map attributes between external and internal representation
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
