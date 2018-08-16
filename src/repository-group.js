import { Owner } from './owner';

/**
 * Abstract repository as a collection
 * @param {Provider} provider
 * @param {string} name of the group
 *
 * @property {Provider} provider
 * @property {string} name
 */
export class RepositoryGroup extends Owner {
  constructor(provider, name) {
    super();
    Object.defineProperties(this, {
      name: { value: name },
      provider: { value: provider }
    });
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
