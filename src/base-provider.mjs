import { asArray, stripBaseName } from "./util.mjs";
import { definePropertiesFromOptions } from "./attribute.mjs";
import { PullRequest } from "./pull-request.mjs";
import { RepositoryGroup } from "./repository-group.mjs";
import { Repository } from "./repository.mjs";
import { Branch } from "./branch.mjs";
import { Hook } from "./hook.mjs";

/**
 *
 */
export class BaseProvider {
  /**
   * Extract options suitable for the constructor
   * form the given set of environment variables
   * @param {Object} env taken from process.env
   * @return {Object} undefined if no suitable environment variables have been found
   */
  static optionsFromEnvironment(env) {
    if (env === undefined) {
      return undefined;
    }

    const attributes = this.attributes;
    let options;

    for (let [envName, value] of Object.entries(env)) {
      for (const [name, attribute] of Object.entries(attributes)) {
        if (asArray(attribute.env).find(e => e === envName)) {
          if (options === undefined) {
            options = {};
          }
          options[name] = value;
          Object.assign(options, attribute.additionalAttributes);
          break;
        }
      }
    }

    return options;
  }

  /**
   * Check if given options are sufficient to create a provider
   * @param {Object} options
   * @return {boolean} true if options ar sufficient to construct a provider
   */
  static areOptionsSufficcient(options) {
    for (const [name, attribute] of Object.entries(this.attributes).filter(
      ([name, attribute]) => attribute.mandatory
    )) {
      if (options[name] === undefined) {
        return false;
      }
    }

    return true;
  }

  static get attributes() {
    return {
      /**
       * In case there are several provider able to support a given source which one sould be used ?
       * this defines the order
       */
      priority: {
        default: 0
      }
    };
  }

  /**
   * Creates a new provider for a given set of options
   * @param {Object} options additional options
   * @param {Object} env taken from process.env
   * @return {Provider} newly created provider or undefined if options are not sufficient to construct a provider
   */
  static initialize(options, env) {
    options = { ...options, ...this.optionsFromEnvironment(env) };
    return this.areOptionsSufficcient(options) ? new this(options) : undefined;
  }

  constructor(options, properties) {
    definePropertiesFromOptions(this, options, properties);
  }

  /**
   * @return {boolean} true if other provider is the same as the receiver
   */
  equals(other) {
    return this === other;
  }

  /**
   * All possible base urls
   * For github something like
   * - git@github.com
   * - git://github.com
   * - git+ssh://github.com
   * - https://github.com
   * - git+https://github.com
   * @return {string[]} common base urls of all repositories
   */
  get repositoryBases() {
    return ["/"];
  }

  /**
   * Bring a repository name into its normal form by removing any clutter
   * like .git suffix or #branch names
   * @param {string} name
   * @param {boolean} forLookup
   * @return {string} normalized name
   */
  normalizeRepositoryName(name, forLookup) {
    const { repository } = this.parseName(name);
    return forLookup && !this.areRepositoryNamesCaseSensitive
      ? repository.toLowerCase()
      : repository;
  }

  /**
   * Bring a group name into its normal form by removing any clutter
   * like .git suffix or #branch names
   * @param {string} name
   * @param {boolean} forLookup
   * @return {string} normalized name
   */
  normalizeGroupName(name, forLookup) {
    return name && forLookup && !this.areGroupNamesCaseSensitive
      ? name.toLowerCase()
      : name;
  }

  /**
   * Are repositroy names case sensitive.
   * Overwrite and return false if you want to have case insensitive repository lookup
   * @return {boolean} true
   */
  get areRepositoryNamesCaseSensitive() {
    return true;
  }

  /**
   * Are repositroy group names case sensitive.
   * Overwrite and return false if you want to have case insensitive group lookup
   * @return {boolean} true
   */
  get areGroupNamesCaseSensitive() {
    return true;
  }

  /**
   * Does the provider support the base name
   * @param {string} base to be checked
   * @return {boolean} true if base is supported or base is undefined
   */
  supportsBase(base) {
    if (base === undefined) {
      return true;
    }

    for (const b of this.repositoryBases) {
      if (b === base) {
        return true;
      }
    }

    return false;
  }

  /**
   * strip away any provider base
   *
   * @param {string|string[]} patterns
   * @returns {string|string[]} stripped patterns
   */
  removeProviderBase(patterns) {
    if (patterns === undefined) {
      return undefined;
    }
    return Array.isArray(patterns)
      ? patterns.map(p => stripBaseName(p, this.repositoryBases))
      : stripBaseName(patterns, this.repositoryBases);
  }

  /**
   * Parses repository name and tries to split it into
   * base, group, repository and branch
   * @param {string} name
   * @return {Object}
   */
  parseName(name) {
    const result = {};

    if (name === undefined) {
      return result;
    }

    name = name.replace(
      /^\s*(git\+)?(([\w\-\+]+:\/\/)[^\@]+@)?/,
      (m, a, b, r) => r || ""
    );

    name = stripBaseName(
      name,
      this.repositoryBases,
      extractedBase => (result.base = extractedBase)
    );

    name = name.replace(
      /^(git@[^:\/]+[:\/]|[\w\-^+]+:\/\/[^\/]+\/)/,
      (m, base) => {
        result.base = base;
        return "";
      }
    );

    let rightAligned;

    name = name.replace(/((\.git)?(#([^\s]*))?)\s*$/, (m, a, b, c, branch) => {
      if (branch) {
        result.branch = branch;
      }
      rightAligned = a.length > 0;
      return "";
    });

    const parts = name.split(/\//);

    if (parts.length >= 2) {
      const i = rightAligned ? parts.length - 2 : 0;
      result.group = parts[i];
      result.repository = parts[i + 1];
    } else {
      result.repository = name;
    }

    return result;
  }

  async createRepository(name, options) {
    const rg = await this.repositoryGroup(name);
    return rg.createRepository(name, options);
  }

  async *listGroups(patterns) {
    if (patterns === undefined) {
      for await (const group of this.repositoryGroups()) {
        yield group;
      }
    } else {
      for (const pattern of asArray(patterns)) {
        const [groupPattern, repoPattern] = stripBaseName(
          pattern,
          this.repositoryBases
        ).split(/\//);

        for await (const group of this.repositoryGroups(groupPattern)) {
          yield group;
        }
      }
    }
  }

  /**
   * List provider objects of a given type
   *
   * @param {string} type name of the method to deliver typed iterator
   * @param {string|string[]} patterns group / repository filter
   */
  async *list(type, patterns) {
    if (patterns === undefined) {
      for await (const group of this.repositoryGroups()) {
        yield* group[type]();
      }
    } else {
      for (let pattern of asArray(patterns)) {
        const [groupPattern, repoPattern] = stripBaseName(
          pattern,
          this.repositoryBases
        ).split(/\//);

        for await (const group of this.repositoryGroups(groupPattern)) {
          yield* group[type](repoPattern);
        }
      }
    }
  }

  /**
   * List repositories
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repos of the provider
   */
  async *repositories(patterns) {
    yield* this.list("repositories", patterns);
  }

  /**
   * List branches
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching branches of the provider
   */
  async *branches(patterns) {
    yield* this.list("branches", patterns);
  }

  /**
   * List tags
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching tags of the provider
   */
  async *tags(patterns) {
    yield* this.list("tags", patterns);
  }

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
   * We are our own provider
   * @return {Provider} this
   */
  get provider() {
    return this;
  }

  toString() {
    return this.name;
  }

  /**
   * List all defined entries from attributes
   *
   */
  toJSON() {
    const json = { name: this.name };

    Object.keys(this.constructor.attributes).forEach(k => {
      if (this[k] !== undefined && typeof this[k] !== "function") {
        json[k] = this[k];
      }
    });

    return json;
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
   * @return {Class} entry class used by the Provider
   */
  get entryClass() {
    return undefined;
  }

  /**
   * @return {Class} pull request class used by the Provider
   */
  get pullRequestClass() {
    return PullRequest;
  }

  initializeRepositories() {}
}
