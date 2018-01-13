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

  /**
   * called one after constructing to
   * @return {Promise}
   */
  async initialize() {}

  async content(...args) {
    const branch = await this.branch('master');
    return branch.content(...args);
  }

  /**
   * Lookup branch by name
   * @param {string} name
   * @return {Promise<Branch>}
   */
  async branch(name) {
    return this._branches.get(name);
  }

  /**
   * @return {Promise<Map>} of all branches
   */
  async branches() {
    return this._branches;
  }

  /**
   * Create a new  {@link Branch}.
   * @param {string} name
   * @param {Promise<Branch>} source branch defaults to master
   */
  async createBranch(name, source) {
    return notImplementedError();
  }

  /**
   * Delete a {@link Branch}
   * @param {string} name
   * @return {Promise}
   */
  async deleteBranch(name) {
    this._branches.delete(name);
  }

  /**
   * Add a branch
   * @param {Branch} branch
   * @return {Promise}
   */
  async addBranch(branch) {
    this._branches.set(branch.name, branch);
  }

  async createPullRequest() {
    return notImplementedError();
  }

  /**
   * Deliver all @{link PullRequest}s
   * @return {Promise<Map>} of all pull requests
   */
  async pullRequests() {
    return this._pullRequests;
  }

  /**
   * Deliver @{link PullRequest} for a given name
   * @param {string} name
   * @return {Promise<PullRequest>}
   */
  async pullRequest(name) {
    return this._pullRequests.get(name);
  }

  /**
   * Add a pull request
   * @param {PullRequest} pullRequest
   * @return {Promise}
   */
  async addPullRequest(pullRequest) {
    this._pullRequests.set(pullRequest.name, pullRequest);
  }

  /**
   * Delete a {@link PullRequest}
   * @param {string} name
   * @return {Promise}
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
