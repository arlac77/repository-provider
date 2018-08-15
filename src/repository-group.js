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
}
