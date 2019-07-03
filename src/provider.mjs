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
    if (env === undefined) {
      return undefined;
    }

    let options;

    const o = this.environmentOptions;

    for (const k of Object.keys(o)) {
      if (env[k] !== undefined) {
        if (options === undefined) {
          options = {};
        }

        let def = o[k];

        if (typeof def === "string") {
          def = { path: def, template: {} };
        }

        let t = options;

        const keyPath = def.path.split(/\./);

        for (let n = 0; ; n++) {
          const key = keyPath[n];

          if (n === keyPath.length - 1) {
            t[key] = def.parse ? def.parse(env[k]) : env[k];
            break;
          }
          if (t[key] === undefined) {
            t[key] = def.template;
          }
          t = t[key];
        }
      }
    }

    return options;
  }

  /**
   * known mapping from environment variable to options
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

  /**
   * Creates a new provider for a given set of options
   * @param {Object} options additional options
   * @param {Object} env taken from process.env
   * @return {Provider} newly createdprovider or undefined if optionsa re not sufficient to construct a provider
   */
  static initialize(options, env) {
    options = { ...options, ...this.optionsFromEnvironment(env) };
    return this.areOptionsSufficciant(options) ? new this(options) : undefined;
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
    return [];
  }

  /**
   * bring a repository name into istnormal form by removing any clutter
   * like .git suffix or #branch names
   * @param {string} name
   * @return {string} normalized name
   */
  normalizeRepositoryName(name) {
    for (const b of this.repositoryBases) {
      if (name.startsWith(b)) {
        name = name.substring(b.length);
        break;
      }
    }

    return name.replace(/\.git(#.*)?$/, "").replace(/#.*$/, "");
  }

  /**
   * parses repository name ans tries to split it into
   * group,repository and branch
   * @param {string} name
   * @return {Object}
   */
  parseName(name) {
    name = name.replace(/^([\w\-\+]+:\/\/)[^\@]+@/, (match, g1) => g1);
    name = name.replace(/^git\+/, "");

    for (const b of this.repositoryBases) {
      if (name.startsWith(b)) {
        name = name.substring(b.length);
        break;
      }
    }

    if (name.startsWith("/")) {
      name = name.substring(1);
    }

    const result = {};
    const m = name.match(/#(.*)$/);
    if (m) {
      result.branch = m[1];
      name = name.replace(/#.*$/, "");
    }

    name = name.replace(/\.git$/, "");

    const parts = name.split(/\//);

    if (parts.length === 2) {
      result.group = parts[0];
      result.repository = parts[1];
    } else {
      result.repository = name;
    }

    return result;
  }

  /**
   * Lookup a repository in the provider and all of its repository groups
   * @param {string} name of the repository
   * @return {Promise<Repository>}
   */
  async repository(name) {
    if (name === undefined) {
      return undefined;
    }

    await this.initialize();

    const { group, repository } = this.parseName(name);

    if (group !== undefined) {
      const rg = await this.repositoryGroup(group);
      if (rg !== undefined) {
        const r = await rg.repository(repository);
        if (r !== undefined) {
          return r;
        }
      }
    }

    const r = await super.repository(repository);

    if (r !== undefined) {
      return r;
    }

    for (const p of this._repositoryGroups.values()) {
      const r = await p.repository(repository);
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
    for (const name of this.match(this._repositoryGroups.keys(), patterns)) {
      yield this._repositoryGroups.get(name);
    }
  }

  /**
   * List repositories
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repos of the provider
   */
  async *repositories(patterns) {
    await this.initialize();

    if (patterns === undefined) {
      for (const name of this._repositoryGroups.keys()) {
        const rg = this._repositoryGroups.get(name);
        yield* rg.repositories();
      }

      return;
    }

    for (const pattern of asArray(patterns)) {
      const [groupPattern, repoPattern] = pattern.split(/\//);

      for await (const group of this.repositoryGroups(groupPattern)) {
        yield* group.repositories(repoPattern);
      }
    }
  }

  /**
   * List branches
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching branches of the provider
   */
  async *branches(patterns) {
    await this.initialize();

    for (const pattern of asArray(patterns)) {
      const [groupPattern, repoPattern] = pattern.split(/\//);

      for await (const group of this.repositoryGroups(groupPattern)) {
        yield* group.branches(repoPattern);
      }
    }
  }

  /**
   * List tags
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching tags of the provider
   */
  async *tags(patterns) {
    await this.initialize();

    for (const pattern of asArray(patterns)) {
      const [groupPattern, repoPattern] = pattern.split(/\//);

      for await (const group of this.repositoryGroups(groupPattern)) {
        yield* group.tags(repoPattern);
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
