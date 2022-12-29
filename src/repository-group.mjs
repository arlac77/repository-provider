import { RepositoryOwner } from "./repository-owner.mjs";
import { OwnedObject } from "./owned-object.mjs";
import { BaseProvider } from "./base-provider.mjs";
import { url } from "./attributes.mjs";

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

export class RepositoryGroup extends RepositoryOwner(OwnedObject) {

  static get addMethodName() {
    return "_addRepositoryGroup";
  }

  static get type() {
    return "repository-group";
  }

  static get collectionName() {
    return "repositoryGroups";
  }

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
      url,

      /**
       * Avatar.
       * @return {string}
       */
      avatarURL: { type: "url" },

      isAdmin: { type: "boolean", default: false }
    };
  }

  /**
   * Map attributes between external and internal representation.
   */
  static get attributeMapping() {
    return {};
  }

  get provider()
  {
    return this.owner;
  }

  get isAdmin() {
    return false;
  }

  get areRepositoryNamesCaseSensitive() {
    return this.owner.areRepositoryNamesCaseSensitive;
  }

  get areRepositoryGroupNamesCaseSensitive() {
    return this.owner.areRepositoryGroupNamesCaseSensitive;
  }
}
