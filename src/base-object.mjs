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

  /**
   * Creates an instance of BaseObject.
   * @param {object} options
   * @param {object} additionalProperties
   */
  constructor(options, additionalProperties) {
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
   * @return {string} name
   */
  toString() {
    return this.name;
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

  /**
   * The provider we live in.
   * @return {BaseProvider}
   */
  get provider() {
    return this.owner.provider;
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  trace(...args) {
    return this.owner.trace(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  info(...args) {
    return this.owner.info(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  warn(...args) {
    return this.owner.warn(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  error(...args) {
    return this.owner.error(...args);
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get repositoryClass() {
    return this.owner.repositoryClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get pullRequestClass() {
    return this.owner.pullRequestClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get branchClass() {
    return this.owner.branchClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get tagClass() {
    return this.owner.tagClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get entryClass() {
    return this.owner.entryClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get hookClass() {
    return this.owner.hookClass;
  }
}
