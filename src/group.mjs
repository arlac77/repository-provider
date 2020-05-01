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
       * the description of the repository group.
       * @return {string}
       */
      description: undefined,

      /**
       * unique id within the provider.
       * @return {string}
       */
      id: undefined,

      /**
       * unique id.
       * @return {string}
       */
      uuid: undefined,

      /**
       * group home.
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
    return optionJSON(this, { name: this.name }, ["logLevel"]);
  }
}
