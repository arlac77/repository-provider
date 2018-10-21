import { notImplementedError, propertiesFromOptions } from "./util";

/**
 * Abstract pull request
 * {@link Repository#addPullRequest}
 * @param {Repositoy} repository
 * @param {string} name
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.state]
 * @param {boolean} [options.merged]
 * @param {boolean} [options.locked]

 * @property {string} name
 * @property {Repository} repository
 * @property {Provider} provider
 * @property {string} [title]
 * @property {string} [state]
 * @property {boolean} [merged]
 * @property {boolean} [locked]
 */
export class PullRequest {
  static get defaultOptions() {
    return {
      /**
       * internal id.
       * @return {string}
       */
      id: undefined,

      /**
       * the one line description of the pull request.
       * @return {string}
       */
      title: undefined,

      /**
       * the description of the pull request.
       * @return {string}
       */
      body: undefined,

      /**
       * state of the pull request.
       * @return {string}
       */
      state: undefined,

      /**
       * locked state of the pull request.
       * @return {boolean}
       */
      locked: false,

      /**
       * merged state of the pull request.
       * @return {boolean}
       */
      merged: false
    };
  }

  constructor(repository, name, options) {
    const properties = {
      name: { value: name },
      repository: { value: repository }
    };

    propertiesFromOptions(properties, options, this.constructor.defaultOptions);

    let merged = properties.merged.value;
    properties.merged = {
      set(value) { merged = value; },
      get() { return merged; }
    }

    let state = properties.state.value;
    properties.state = {
      set(value) { state = value; },
      get() { return state; }
    }

    Object.defineProperties(this, properties);

    repository.addPullRequest(this);
  }

  /**
   * @return {Provider}
   */
  get provider() {
    return this.repository.provider;
  }

  /**
   * Delete the pull request from the {@link Repository}.
   * @see {@link Repository#deletePullRequest}
   * @return {Promise}
   */
  async delete() {
    return this.repository.deletePullRequest(this.name);
  }

  /**
   * Merge the pull request
   */
  async merge() {
    return notImplementedError();
  }

  /**
   * Decline the pull request
   */
  async decline() {
    return notImplementedError();
  }
}
