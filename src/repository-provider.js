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
   * @return {Class} repository class used by the Provider
   */
  static get repositoryClass() {
    return Repository;
  }

  /**
   * @return {Class} branch class used by the Provider
   */
  static get branchClass() {
    return Branch;
  }

  /**
   * @return {Class} pull request class used by the Provider
   */
  static get pullRequestClass() {
    return PullRequest;
  }

  /**
   * Default configuration options
   * @return {Object}
   */
  static get defaultOptions() {
    return {};
  }

  /**
   * Pepare configuration by mixing together defaultOptions with actual options
   * @param {Object} config
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
   * @param {string} name
   * @return {Repository}
   */
  async repository(name) {
    let r = this.repositories.get(name);
    if (r === undefined) {
      r = new this.constructor.repositoryClass(this, name);
      await r.initialize();
      this.repositories.set(name, r);
    }

    return r;
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
