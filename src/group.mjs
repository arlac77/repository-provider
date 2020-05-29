import { Owner } from "./owner.mjs";
import { definePropertiesFromOptions, optionJSON } from "./util.mjs";

/**
 * Abstract repository collection
 * @param {Provider} provider
 * @param {string} name of the group
 * @param {Object} options
 * @param {string} [options.description] human readable description
 * @param {string} [options.id] internal id
 * @param {string} [options.uuid] internal id
 * @param {string} [options.url] home
 *
 * @property {Provider} provider
 * @property {string} name
 */
export class RepositoryGroup extends Owner {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      /**
       * The description of the repository group.
       * @return {string}
       */
      description: undefined,

      /**
       * The name suitable for human.
       * @return {string}
       */
      displayName: undefined,

      /**
       * Unique id within the provider.
       * @return {string}
       */
      id: undefined,

      /**
       * Unique id.
       * @return {string}
       */
      uuid: undefined,

      /**
       * Type of the repository group either User or Organization.
       * @return {string}
       */
      type: undefined,
      
      /**
       * Group home.
       * @return {string}
       */
      url: undefined
    };
  }

  constructor(provider, name, options) {
    super();

    definePropertiesFromOptions(this, options, {
      name: { value: name },
      provider: { value: provider }
    });
  }

  /**
   * 
   * @return {string} name suitable for humans
   */
  get displayName()
  {
    return this.name;
  }

  get areRepositoryNamesCaseSensitive()
  {
    return this.provider.areRepositoryNamesCaseSensitive;
  }

  get areRepositoryGroupNamesCaseSensitive()
  {
    return this.provider.areRepositoryGroupNamesCaseSensitive;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get repositoryClass() {
    return this.provider.repositoryClass;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get branchClass() {
    return this.provider.branchClass;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get contentClass() {
    return this.provider.contentClass;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get pullRequestClass() {
    return this.provider.pullRequestClass;
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return optionJSON(this, { name: this.name }, ["logLevel", "displayName"]);
  }
}
