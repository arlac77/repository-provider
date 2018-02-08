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
   * Called one after constructing
   * @return {Promise<undefined>}
   */
  async initialize() {}

  /**
   * Lookup content form the default branch
   * {@link Branch#content}
   * @return {Content}
   */
  async content(...args) {
    return (await this.defaultBranch).content(...args);
  }

  /**
   * urls to access the repo
   * @return {string[]}
   */
  get urls() {
    return [];
  }

  /**
   * preffered url to access the repo
   * @return {string}
   */
  get url() {
    return this.urls[0];
  }

  /**
   * the url of issue tracking system.
   * @return {string}
   */
  get issuesURL() {
    return undefined;
  }

  /**
   * the url of home page.
   * @return {string}
   */
  get homePageURL() {
    return undefined;
  }

  /**
   * Repository owner
   * Default implementation delivers undefined
   * @return {string} undefined
   */
  get owner() {
    return undefined;
  }

  /**
   * Repository project
   * Default implementation delivers undefined
   * @return {string} undefined
   */
  get project() {
    return undefined;
  }

  /**
   * Name without project / owner
   * @return {string} name
   */
  get condensedName() {
    return this.name;
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
   * Create a new {@link Branch} by cloning a given source branch
   * @param {string} name
   * @param {Branch} source branch defaults to master
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
   * @return {Promise<undefined>}
   */
  async addBranch(branch) {
    this._branches.set(branch.name, branch);
  }

  /**
   * Delete the repository from the {@link Provider}.
   * {@link Provider#deleteRepository}
   * @return {Promise<undefined>}
   */
  async delete() {
    return this.provider.deleteRepository(this.name);
  }

  async createPullRequest() {
    return notImplementedError();
  }

  /**
   * Deliver all {@link PullRequest}s
   * @return {Promise<Map>} of all pull requests
   */
  async pullRequests() {
    return this._pullRequests;
  }

  /**
   * The @{link PullRequest} for a given name
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
   * @return {string} providers type
   */
  get type() {
    return this.provider.type;
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
