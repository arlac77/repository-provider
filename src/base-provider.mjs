import { asArray } from "./util.mjs";
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

    let options;

    const o = this.environmentOptions;

    for (let [k, v] of Object.entries(o)) {
      if (env[k] !== undefined) {
        if (options === undefined) {
          options = {};
        }

        if (typeof v === "string") {
          v = { path: v, template: {} };
        }

        let t = options;

        const keyPath = v.path.split(/\./);

        for (let n = 0; ; n++) {
          const key = keyPath[n];

          if (n === keyPath.length - 1) {
            t[key] = v.parse ? v.parse(env[k]) : env[k];
            break;
          }
          if (t[key] === undefined) {
            t[key] = v.template;
          }
          t = t[key];
        }
      }
    }

    return options;
  }

  /**
   * Known mapping from environment variable to options
   * @return {Object} with the mapping of environmentvaraible names to option keys
   */
  static get environmentOptions() {
    return {};
  }

  /**
   * Check if given options are sufficint to create a provider
   * @param {Object} options
   * @return {boolean} true if options ar sufficiant to construct a provider
   */
  static areOptionsSufficciant(options) {
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
    return this.areOptionsSufficciant(options) ? new this(options) : undefined;
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
   * Parses repository name and tries to split it into
   * base, group, repository and branch
   * @param {string} name
   * @return {Object}
   */
  parseName(name) {
    name = name.replace(
      /^\s*(git\+)?(([\w\-\+]+:\/\/)[^\@]+@)?/,
      (m, a, b, r) => r || ""
    );

    const result = {};

    for (const b of this.repositoryBases) {
      if (name.startsWith(b)) {
        result.base = b;
        name = name.slice(b.length);
        break;
      }
    }
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

  /**
   * @param {string} name
   */
  async decomposeName(name) {
    if (name === undefined) {
      return {};
    }

    const { base, group, repository, branch } = this.parseName(name);

    if (base !== undefined) {
      if (!this.repositoryBases.find(x => x === base)) {
        return {};
      }
    }

    if (group !== undefined) {
      const rg = await this.repositoryGroup(group);
      if (rg !== undefined) {
        const r = await rg.repository(repository);
        if (r !== undefined) {
          return { repository: r, branch };
        }
      }

      return {};
    }

    for await (const p of this.repositoryGroups()) {
      const r = await p.repository(repository);
      if (r !== undefined) {
        return { repository: r, branch };
      }
    }

    return {};
  }

  /**
   * Lookup a repository in the provider and all of its repository groups
   * @param {string} name of the repository
   * @return {Promise<Repository>}
   */
  async repository(name) {
    const { repository } = await this.decomposeName(name, "R");
    return repository;
  }

  /**
   * List repositories
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repos of the provider
   */
  async *repositories(patterns) {
    if (patterns === undefined) {
      for await (const group of this.repositoryGroups()) {
        yield* group.repositories();
      }
    } else {
      for (const pattern of asArray(patterns)) {
        const [groupPattern, repoPattern] = pattern.split(/\//);

        for await (const group of this.repositoryGroups(groupPattern)) {
          yield* group.repositories(repoPattern);
        }
      }
    }
  }

  async createRepository(name, options) {
    const rg = await this.repositoryGroup(name);
    return rg.createRepository(name, options);
  }

  /**
   * Lookup a branch in the provider and all of its repository groups
   * @param {string} name of the branch
   * @return {Promise<Branch>}
   */
  async branch(name) {
    const { repository, branch } = await this.decomposeName(name, "B");

    return repository === undefined
      ? undefined
      : repository.branch(
          branch === undefined ? repository.defaultBranchName : branch
        );
  }

  /**
   * List branches
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching branches of the provider
   */
  async *branches(patterns) {
    if (patterns === undefined) {
      for await (const group of this.repositoryGroups()) {
        yield* group.branches();
      }
    } else {
      for (const pattern of asArray(patterns)) {
        const [groupPattern, repoPattern] = pattern.split(/\//);

        for await (const group of this.repositoryGroups(groupPattern)) {
          yield* group.branches(repoPattern);
        }
      }
    }
  }

  /**
   * List tags
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching tags of the provider
   */
  async *tags(patterns) {
    if (patterns === undefined) {
      for await (const group of this.repositoryGroups()) {
        yield* group.tags();
      }
    } else {
      for (const pattern of asArray(patterns)) {
        const [groupPattern, repoPattern] = pattern.split(/\//);

        for await (const group of this.repositoryGroups(groupPattern)) {
          yield* group.tags(repoPattern);
        }
      }
    }
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
