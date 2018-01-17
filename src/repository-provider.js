import { Branch } from './branch';
import { Repository } from './repository';
import { PullRequest } from './pull-request';
import { notImplementedError } from './util';

export { Repository, Branch, PullRequest };

/**
 * @typedef {Object} Content
 * @property {string|Buffer} content
 * @property {string} path file name inside of the repository
 * @property {string} mode file permissions
 * @property {string} type
 */

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} options
 * @property {Map} repositories
 * @property {Object} config
 */
export class Provider {
  /**
   * Default configuration options
   * @return {Object}
   */
  static get defaultOptions() {
    return {};
  }

  /**
   * Pepare configuration by mixing together defaultOptions with actual options
   * @param {Object} config raw config
   * @return {Object} combined options
   */
  static options(config) {
    return Object.assign(this.defaultOptions, config);
  }

  constructor(options) {
    Object.defineProperties(this, {
      config: {
        value: this.constructor.options(options)
      },
      repositories: { value: new Map() }
    });
  }

  async _initialize() {
    if (this._isInitialized) {
      return;
    }
    this._isInitialized = true;
    await this.initialize();
  }

  /**
   * Provider initialization
   * will be called once before content addressing method is called
   * @see {@link Provider#repository}
   * @see {@link Provider#branch}
   * @see {@link Provider#createRepository}
   * @see {@link Provider#deleteRepository}
   * @return {Promise<undefined>}
   */
  async initialize() {}

  /**
   * @return {Class} repository class used by the Provider
   */
  get repositoryClass() {
    return Repository;
  }

  /**
   * @return {Class} branch class used by the Provider
   */
  get branchClass() {
    return Branch;
  }

  /**
   * @return {Class} pull request class used by the Provider
   */
  get pullRequestClass() {
    return PullRequest;
  }

  /**
   * Create a new repository
   * @param {string} name
   * @param {Object} options
   * @return {Promise<Repository>}
   */
  async createRepository(name, options) {
    await this._initialize();
    const repository = new this.repositoryClass(this, name, options);
    await repository.initialize();
    this.repositories.set(name, repository);
    return repository;
  }

  /**
   * Delete a repository
   * @param {string} name
   * @return {Promise<undefined>}
   */
  async deleteRepository(name) {
    await this._initialize();
    this.repositories.delete(name);
  }

  /**
   * Lookup a repository
   * @param {string} name
   * @return {Promise<Repository>}
   */
  async repository(name) {
    await this._initialize();
    return this.repositories.get(name);
  }

  /**
   * Lookup a branch
   * First lookup repository then the branch
   * If no branch was specified then the default branch will be delivered.
   * @see {@link Repository#defaultBranch}
   * @param {string} name with optional branch name as '#myBranchName'
   * @return {Promise<Branch>}
   */
  async branch(name) {
    await this._initialize();
    const [repoName, branchName] = name.split(/#/);
    let repository;

    if (branchName !== undefined) {
      repository = await this.repository(repoName);
      if (repository !== undefined) {
        return repository.branch(branchName);
      }
    }

    repository = await this.repository(repoName);

    if (repository === undefined) {
      throw new Error(`Unknown repository ${repoName}`);
    }

    return repository.defaultBranch;
  }

  /**
   * Is our rate limit reached.
   * By default we have no rate limit
   * @return {boolean} always false
   */
  get rateLimitReached() {
    return false;
  }

  /**
   * Deliver the repository type
   * @return {string} 'git'
   */
  get type() {
    return 'git';
  }
}
