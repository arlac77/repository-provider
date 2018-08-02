/**
 * Abstract project
 * @param {Provider} provider
 * @param {string} name
 *
 * @property {Provider} provider
 * @property {string} name
 */
export class Project {
  constructor(provider, name) {
    Object.defineProperties(this, {
      name: { value: name },
      provider: { value: provider }
    });
  }
}
