import { Branch } from "./branch.mjs";
import { Owner } from "./owner.mjs";
import { RepositoryOwnerMixin } from "./owner-mixin.mjs";
import { Repository } from "./repository.mjs";
import { PullRequest } from "./pull-request.mjs";
import { Hook } from "./hook.mjs";
import { RepositoryGroup } from "./group.mjs";
import { definePropertiesFromOptions, asArray } from "./util.mjs";

export {
  Repository,
  Branch,
  PullRequest,
  Owner,
  RepositoryOwnerMixin,
  RepositoryGroup,
  Hook
};

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} options
 * @property {Map<string,RepositoryGroup>} _repositoryGroups
 */
export class Provider extends Owner {
  /**
   * Extract options suitable for the constructor
   * form the given set of environment variables
   * @param {Object} env taken from process.env
   * @return {Object} undefined if no suitable environment variables have been found
   */
  static optionsFromEnvironment(env) {
    return undefined;
  }

  static get defaultOptions() {
    return {
      /**
       * in case there are several provider able to support a given source which one sould be used ?
       * this defines the order
       */
      priority: 0,
      ...super.defaultOptions
    };
  }

  constructor(options) {
    super();

    definePropertiesFromOptions(this, options, {
      _repositoryGroups: { value: new Map() }
    });

    this.trace(level => options);
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
    await this.initialize();
    return this._repositoryGroups.get(name);
  }

  /**
   * Create a new repository group
   * If there is already a group for the given name it will be returend instead
   * @param {string} name of the group
   * @param {Object} options
   * @return {Promise<RepositoryGroup>}
   */
  async createRepositoryGroup(name, options) {
    let repositoryGroup = await this.repositoryGroup(name);
    if (repositoryGroup === undefined) {
      repositoryGroup = this._createRepositoryGroup(name, options);
    }

    return repositoryGroup;
  }

  async _createRepositoryGroup(name, options) {
    const repositoryGroup = new this.repositoryGroupClass(this, name, options);
    await repositoryGroup.initialize();
    this._repositoryGroups.set(name, repositoryGroup);
    return repositoryGroup;
  }

  /**
   * Lookup a repository in the provider and all of its repository groups
   * @param {string} name of the repository
   * @return {Promise<Repository>}
   */
  async repository(name) {
    await this.initialize();

    const r = await super.repository(name);

    if (r !== undefined) {
      return r;
    }

    for (const p of this._repositoryGroups.values()) {
      const r = await p.repository(name);
      if (r !== undefined) {
        return r;
      }
    }

    return undefined;
  }

  /**
   * Lookup a branch in the provider and all of its repository groups
   * @param {string} name of the branch
   * @param {Object} options
   * @return {Promise<Branch>}
   */
  async branch(name, options) {
    await this.initialize();

    const r = await super.branch(name, options);

    if (r !== undefined) {
      return r;
    }

    for (const p of this._repositoryGroups.values()) {
      const r = await p.branch(name, options);
      if (r !== undefined) {
        return r;
      }
    }

    return undefined;
  }

  /**
   * List groups
   * @param {string[]|string} patterns
   * @return {Iterator<RepositoryGroup>} all matching repositories groups of the provider
   */
  async *repositoryGroups(patterns) {
    await this.initialize();
    for (const name of this.match(
      [...this._repositoryGroups.keys()],
      patterns
    )) {
      yield this._repositoryGroups.get(name);
    }
  }

  /**
   * List repositories
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching branches of the provider
   */
  async *repositories(patterns = ["*/*"]) {
    await this.initialize();
    patterns = asArray(patterns);

    const level0Patterns = patterns.map(p => p.split(/\//)[0]);
    const level1Patterns = patterns.map(p => p.split(/\//)[1]);

    for(const name of this._repositoryGroups.keys()) {
      for(const m of level0Patterns) {
        if(m === '*' || m === name) {
          const rg = this._repositoryGroups.get(name);
          yield* rg.repositories(level1Patterns);
        }
      }
    }
  }

  /**
   * List branches
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching branches of the provider
   */
  async *branches(patterns) {}

  /**
   * List tags
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching tags of the provider
   */
  async *tags(patterns) {}

  /**
   * @return {Class} repository group class used by the Provider
   */
  get repositoryGroupClass() {
    return RepositoryGroup;
  }

  /**
   * @return {Class} hook class used by the Provider
   */
  get hookClass() {
    return Hook;
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

  toString() {
    return this.name;
  }

  /**
   * list all defined entries from defaultOptions
   *
   */
  toJSON() {
    const json = { name: this.name };

    Object.keys(this.constructor.defaultOptions).forEach(k => {
      if (this[k] !== undefined && typeof this[k] !== "function") {
        json[k] = this[k];
      }
    });

    return json;
  }
}
