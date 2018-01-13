import { Branch } from './branch';
import { Repository } from './repository';
import { PullRequest } from './pull-request';

export { Repository, Branch, PullRequest };

function notImplementedError() {
  return new Error('not implemented');
}

/**
 * @typedef {Object} Content
 * @property {string|Buffer} content
 * @property {string} path file name inside of the repository
 * @property {string} mode file permission
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

  async createRepository(name, options) {
    const repository = new this.repositoryClass(this, name, options);
    this.repositories.set(name, repository);
    return repository;
  }

  /**
   * @param {string} name
   * @return {Repository}
   */
  async repository(name) {
    return this.repositories.get(name);
  }

  /**
   * Is our rate limit reached.
   * By default we have no rate limit
   * @return {boolean} always false
   */
  get rateLimitReached() {
    return false;
  }
}
