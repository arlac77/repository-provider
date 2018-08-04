import { Branch } from './branch';
import { Owner } from './owner';
import { Repository } from './repository';
import { PullRequest } from './pull-request';
import { Project } from './project';
import { Content } from './content';
import { notImplementedError } from './util';

export { Repository, Branch, PullRequest, Owner, Project, Content };

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} options
 * @property {Map} repositories
 * @property {Object} config
 */
export class Provider extends Owner {
  /**
   * Default configuration options
   * @return {Object}
   */
  static get defaultOptions() {
    return {};
  }

  /**
   * Extract options suitable for the constructor
   * form the given set of environment variables
   * @param {Object} env
   * @return {Object} undefined if no suitable environment variables have been found
   */
  static optionsFromEnvironment(env) {
    return undefined;
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
    super();

    Object.defineProperties(this, {
      config: {
        value: this.constructor.options(options)
      },
      projects: { value: new Map() }
    });
  }

  /**
   * @return {Class} branch class used by the Provider
   */
  get branchClass() {
    return Branch;
  }

  /**
   * @return {Class} project class used by the Provider
   */
  get projectClass() {
    return Project;
  }

  /**
   * @return {Class} content class used by the Provider
   */
  get contentClass() {
    return Content;
  }

  /**
   * @return {Class} pull request class used by the Provider
   */
  get pullRequestClass() {
    return PullRequest;
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
   * Deliver the provider name
   * @return {string} class name by default
   */
  get name() {
    return this.constructor.name;
  }
}
