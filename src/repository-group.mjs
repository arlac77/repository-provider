import { RepositoryOwner } from "./repository-owner.mjs";
import { OwnedObject } from "./owned-object.mjs";
import { BaseProvider } from "./base-provider.mjs";
import { url, boolean_attribute, type } from "./attributes.mjs";

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
       */
      type,
      url,
      avatarURL: url,
      isAdmin: boolean_attribute
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
