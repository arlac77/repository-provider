import { notImplementedError, propertiesFromOptions } from "./util";

/**
 * Abstract pull request
 * {@link Repository#addPullRequest}
 * @param {Repositoy} repository
 * @param {string} name
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.state
 *
 * @property {string} name
 * @property {Repository} repository
 * @property {Provider} provider
 * @property {string} [title]
 * @property {string} [state]
 */
export class PullRequest {
  static get defaultOptions() {
    return {
      /**
       * the description of the pull request.
       * @return {string}
       */
      title: undefined,

      /**
       * state of the pull request.
       * @return {string}
       */
      state: undefined
    };
  }

  constructor(repository, name, options) {
    const properties = {
      name: { value: name },
      repository: { value: repository }
    };

    propertiesFromOptions(properties, options, this.constructor.defaultOptions);

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
