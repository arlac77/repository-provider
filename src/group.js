import { Owner } from "./owner";
import { propertiesFromOptions } from "./util";

/**
 * Abstract repository as a collection
 * @param {Provider} provider
 * @param {string} name of the group
 * @param {Object} options
 * @param {string} [options.description] human readable description
 * @param {string} [options.id] internal id

 * @property {Provider} provider
 * @property {string} name
 */
export class RepositoryGroup extends Owner {
  static get defaultOptions() {
    return Object.assign({}, super.defaultOptions, {
      /**
       * the description of the repository content.
       * @return {string}
       */
      description: undefined,

      /**
       * unique id within the provider.
       * @return {string}
       */
      id: undefined
    });
  }

  constructor(provider, name, options) {
    super();

    const properties = {
      name: { value: name },
      provider: { value: provider }
    };

    propertiesFromOptions(properties, options, this.constructor.defaultOptions);

    Object.defineProperties(this, properties);
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
}
