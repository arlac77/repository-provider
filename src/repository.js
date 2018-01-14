import { notImplementedError } from './util';

/**
 * Abstract repository
 * @param {Provider} provider
 * @param {string} name
 * @property {Provider} provider
 * @property {string} name
 * @property {Object} options
 */
export class Repository {
  constructor(provider, name, options) {
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

  /**
   * Lookup content form the default branch
   * @return {Content}
   */
  async content(...args) {
    return (await this.defaultBranch).content(...args);
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
   * Lookup the default branch
   * @return {Promise<Branch>} 'master' branch
   */
  get defaultBranch() {
    return this.branch('master');
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
   * @param {Object} options
   * @return {Promise<Branch>} newly created branch
   */
  async createBranch(name, source, options) {
    const branch = new this.provider.branchClass(this, name, options);
    await branch.initialize();
    this._branches.set(name, branch);
    return branch;
  }

  /**
   * Delete a {@link Branch}
   * @param {string} name
   * @return {Promise<undefined>}
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
