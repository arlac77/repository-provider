import { Branch } from './branch';
import { Owner } from './owner';
import { Repository } from './repository';
import { PullRequest } from './pull-request';
import { RepositoryGroup } from './repository-group';
import { Content } from './content';
import { notImplementedError } from './util';

export { Repository, Branch, PullRequest, Owner, RepositoryGroup, Content };

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} options
 * @property {Map<string,RepositoryGroup>} repositoryGroups
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
      repositoryGroups: { value: new Map() }
    });
  }

  /**
   * Lookup a repository group
   * @param {string} name of the group
   * @return {Promise<RepositoryGroup>}
   */
  async repositoryGroup(name) {
    if (name === undefined) {
      return undefined;
    }
    await this._initialize();
    return this.repositoryGroups.get(name);
  }

  /**
   * Create a new repository group
   * @param {string} name
   * @param {Object} options
   * @return {Promise<RepositoryGroup>}
   */
  async createRepositoryGroup(name, options) {
    await this._initialize();
    const repositoryGroup = new this.repositoryGroupClass(this, name, options);
    await repositoryGroup.initialize();
    this.repositoryGroups.set(name, repositoryGroup);
    return repositoryGroup;
  }

  /**
   * Lookup a repository in the provider and all of its repository groups
   * @param {string} name
   * @return {Promise<Repository>}
   */
  async repository(name) {
    let r = await super.repository(name);

    if (r !== undefined) {
      return r;
    }

    for (const p of this.repositoryGroups.values()) {
      r = await p.repository(name);
      if (r !== undefined) {
        return r;
      }
    }

    return r;
  }

  /**
   * @return {Class} repository group class used by the Provider
   */
  get repositoryGroupClass() {
    return RepositoryGroup;
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

  /**
   * we are our own provider
   * @return {Provider} this
   */
  get provider() {
    return this;
  }
}
