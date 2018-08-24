import { Owner } from "./owner";
import { propertiesFromOptions } from "./util";

/**
 * Abstract repository as a collection
 * @param {Provider} provider
 * @param {string} name of the group
 *
 * @property {Provider} provider
 * @property {string} name
 */
export class RepositoryGroup extends Owner {
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
}
