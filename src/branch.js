/**
 * Abstract git branch
 * @see {@link Repository#addBranch}
 * @param {Repository} repository
 * @param {string} name
 * @property {Repository} repository
 * @property {Provider} provider
 * @property {string} name
 */
export class Branch {
  constructor(repository, name = 'master') {
    Object.defineProperties(this, {
      name: { value: name },
      repository: { value: repository }
    });

    repository.addBranch(this);
  }

  /**
   * @return {Provider}
   */
  get provider() {
    return this.repository.provider;
  }

  /**
   * Delete the branch from the {@link Repository}.
   * @see {@link Repository#deleteBranch}
   * @return {Promise}
   */
  async delete() {
    return this.repository.deleteBranch(this.name);
  }

  /**
   * Deliver file content
   * @param {string} path
   * @return {Promise<Content>} content of a given file
   */
  async content(path) {
    return notImplementedError();
  }

  /**
   * Commit files
   * @param {string} message commit message
   * @param {Content} [updates] file content to be commited
   * @param {Object} options
   * @return {Promise}
   */
  async commit(message, updates, options) {
    return notImplementedError();
  }

  /**
   * Create a pull request
   * @param {Branch} toBranch
   * @param {string} message
   * @return {Promise}
   */
  async createPullRequest(toBranch, message) {
    return notImplementedError();
  }

  /**
   * File list
   */
  async list() {
    return [];
  }

  /**
   * Value delivered from the provider
   * @see {@link Provider#rateLimitReached}
   * @return {boolean} providers rateLimitReached
   */
  get rateLimitReached() {
    return this.provider.rateLimitReached;
  }

  /**
   * forward to the Provider
   * @param {boolean} value
   */
  set rateLimitReached(value) {
    this.provider.rateLimitReached(value);
  }
}
