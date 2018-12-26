import { Branch } from "./branch";
import { Owner } from "./owner";
import { Repository } from "./repository";
import { PullRequest } from "./pull-request";
import { RepositoryGroup } from "./group";
import { BaseEntry } from "content-entry/src/base-entry";
import { BaseCollectionEntry, CollectionEntryMixin } from "content-entry/src/base-collection-entry";
import {
  Entry,
  emptyEntry
} from "./entry";
import { notImplementedError, definePropertiesFromOptions } from "./util";

export {
  Repository,
  Branch,
  PullRequest,
  Owner,
  RepositoryGroup,
  BaseEntry,
  Entry,
  BaseCollectionEntry,
  CollectionEntryMixin,
  emptyEntry
};

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} options
 * @property {Map<string,RepositoryGroup>} repositoryGroups
 */
export class Provider extends Owner {
  /**
   * Extract options suitable for the constructor
   * form the given set of environment variables
   * @param {Object} env
   * @return {Object} undefined if no suitable environment variables have been found
   */
  static optionsFromEnvironment(env) {
    return undefined;
  }

  static get defaultOptions() {
    return Object.assign(
      {
        /**
         * in case there are several provider able to support a given source which one sould be used ?
         * this defines the order
         */
        priority: 0
      },
      super.defaultOptions
    );
  }

  constructor(options) {
    super();

    definePropertiesFromOptions(this, options, {
      repositoryGroups: { value: new Map() }
    });

    this.trace(level => options);
  }

  /**
   * Lookup a repository group
   * @param {string} name of the group
   * @param {Object} options
   * @return {Promise<RepositoryGroup>}
   */
  async repositoryGroup(name, options) {
    if (name === undefined) {
      return undefined;
    }
    await this.initialize();
    return this.repositoryGroups.get(name);
  }

  /**
   * Create a new repository group
   * @param {string} name
   * @param {Object} options
   * @return {Promise<RepositoryGroup>}
   */
  async createRepositoryGroup(name, options) {
    await this.initialize();
    const repositoryGroup = new this.repositoryGroupClass(this, name, options);
    await repositoryGroup.initialize();
    this.repositoryGroups.set(name, repositoryGroup);
    return repositoryGroup;
  }

  /**
   * Lookup a repository in the provider and all of its repository groups
   * @param {string} name of the repository
   * @param {Object} options
   * @return {Promise<Repository>}
   */
  async repository(name, options) {
    await this.initialize();

    const r = await super.repository(name, options);

    if (r !== undefined) {
      return r;
    }

    for (const p of this.repositoryGroups.values()) {
      const r = await p.repository(name, options);
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

    for (const p of this.repositoryGroups.values()) {
      const r = await p.branch(name, options);
      if (r !== undefined) {
        return r;
      }
    }

    return undefined;
  }

  /**
   * @return {Class} repository group class used by the Provider
   */
  get repositoryGroupClass() {
    return RepositoryGroup;
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
