import { Owner } from './owner';

/**
 * Abstract project
 * @param {Provider} provider
 * @param {string} name
 *
 * @property {Provider} provider
 * @property {string} name
 */
export class Project extends Owner {
  constructor(provider, name) {
    super();
    Object.defineProperties(this, {
      name: { value: name },
      provider: { value: provider }
    });
  }
}
