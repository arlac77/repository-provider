/**
 * Abstract repository
 * @param {Provider} provider
 * @param {string} name
 * @property {Provider} provider
 * @property {string} name
 */
export class Repository {
  constructor(provider, name) {
    Object.defineProperties(this, {
      name: { value: name },
      provider: { value: provider },
      _branches: { value: new Map() },
      _pullRequests: { value: new Map() }
    });
  }

  async initialize() {}

  async content(...args) {
    const branch = await this.branch('master');
    return branch.content(...args);
  }

  async branch(name) {
    let b = this._branches.get(name);
    if (b === undefined) {
      b = new this.provider.constructor.branchClass(this, name);
      this._branches.set(name, b);
    }

    return b;
  }

  /**
   * @return {Map} of all branches
   */
  async branches() {
    return this._branches;
  }

  /**
   * Create a new  {@link Branch}.
   * @param {string} name
   * @param {Branch} source branch defaults to master
   */
  async createBranch(name, source) {
    return notImplementedError();
  }

  /**
   * Delete a {@link Branch}
   * @param {string} name
   */
  async deleteBranch(name) {
    this._branches.delete(name);
  }

  async createPullRequest() {
    return notImplementedError();
  }

  /**
   * @return {Map} of all pull requests
   */
  async pullRequests() {
    return this._pullRequests;
  }

  /**
   * Delete a {@link PullRequest}
   * @param {string} name
   */
  async deletePullRequest(name) {
    this._pullRequests.delete(name);
  }

  /**
   * Value delivered from the provider
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
