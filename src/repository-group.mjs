import { RepositoryOwner } from "./repository-owner.mjs";
import { NamedObject } from "./named-object.mjs";
import { BaseProvider } from "./base-provider.mjs";

/**
 * Abstract repository collection.
 * @param {BaseProvider} provider
 * @param {string} name of the group
 * @param {Object} options
 * @param {string} [options.description] human readable description
 * @param {string} [options.id] internal id
 * @param {string} [options.uuid] internal id
 * @param {string} [options.url] home
 *
 * @property {BaseProvider} provider
 * @property {string} name
 */

export class RepositoryGroup extends RepositoryOwner(NamedObject) {
  static get attributes() {
    return {
      ...super.attributes,

      /**
       * Type of the repository group either User or Organization.
       * @return {string}
       */
      type: { type: "string" },

      /**
       * api url
       */
      url: { type: "url" },

      isAdmin: { type: "boolean", default: false }
    };
  }

  /**
   * Map attributes between external and internal representation.
   */
  static get attributeMapping() {
    return {};
  }

  constructor(provider, name, options) {
    super(name, options, {
      provider: { value: provider }
    });
  }

  /**
   * @return {string} name with owner name
   */
  get fullName()
  {
    return this.owner.name + "/" + this.name;
  }

  get owner()
  {
    return this.provider;
  }

  get isAdmin() {
    return false;
  }

  get areRepositoryNamesCaseSensitive() {
    return this.provider.areRepositoryNamesCaseSensitive;
  }

  get areRepositoryGroupNamesCaseSensitive() {
    return this.provider.areRepositoryGroupNamesCaseSensitive;
  }
}
