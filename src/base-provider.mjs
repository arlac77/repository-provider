import { asArray, stripBaseName } from "./util.mjs";
import { PullRequest } from "./pull-request.mjs";
import { RepositoryGroup } from "./repository-group.mjs";
import { Repository } from "./repository.mjs";
import { Branch } from "./branch.mjs";
import { Tag } from "./tag.mjs";
import { Hook } from "./hook.mjs";
import { Project } from "./project.mjs";
import { Milestone } from "./milestone.mjs";
import { BaseObject } from "./base-object.mjs";
import { url, name } from "./attributes.mjs";

/**
 * @typedef {Object} MessageDestination
 * Endpoint to deliver log messages to.
 * @property {Function} info
 * @property {Function} warn
 * @property {Function} error
 * @property {Function} trace
 */

/**
 * @property {MessageDestination} messageDestination
 */
export class BaseProvider extends BaseObject {

  static get type() {
    return "provider";
  }

  /**
   * @return {string} identifier for environment options
   */
  static get instanceIdentifier() {
    return "";
  }

  /**
   * Extract options suitable for the constructor
   * form the given set of environment variables.
   * Object with the detected key value pairs is delivered.
   * @param {Object} env as from process.env
   * @param {string} instanceIdentifier part of variable name.
   * @return {Object} undefined if no suitable environment variables have been found
   */
  static optionsFromEnvironment(
    env,
    instanceIdentifier = this.instanceIdentifier
  ) {
    let options;

    if (env !== undefined) {
      const attributes = this.attributes;

      for (let [envName, value] of Object.entries(env)) {
        for (const [name, attribute] of Object.entries(attributes)) {
          if (
            asArray(attribute.env).find(
              e =>
                e.replace(
                  "{{instanceIdentifier}}",
                  () => instanceIdentifier
                ) === envName
            )
          ) {
            if (options === undefined) {
              options = {};
            }

            if(options[name] === undefined) {
              options[name] = value;
              Object.assign(options, attribute.additionalAttributes);
            }
            break;
          }
        }
      }
    }
    return options;
  }

  /**
   * Check if given options are sufficient to create a provider.
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
      ...super.attributes,
      /**
       * In case there are several providers able to support a given source which one sould be used ?
       * this defines the order
       */
      priority: {
        type: "number",
        default: 0
      },

      /**
       * Name of the provider.
       */
      name: {
        ...name,
        env: ["{{instanceIdentifier}}NAME"]
      },

      url,
 
      /**
       * To forward info/warn and error messages to
       */
      messageDestination: {
        type: "object",
        default: console,
        writable: true,
        private: true
      }
    };
  }

  get priority() {
    return 0;
  }

  /**
   * Creates a new provider for a given set of options.
   * @param {Object} options additional options
   * @param {string} [options.instanceIdentifier] name of the provider instance
   * @param {Object} env taken from process.env
   * @return {BaseProvider} newly created provider or undefined if options are not sufficient to construct a provider
   */
  static initialize(options = {}, env) {
    options = {
      ...options,
      ...this.optionsFromEnvironment(env, options.instanceIdentifier)
    };

    if (this.areOptionsSufficcient(options)) {
      return new this(options);
    }
  }

  /**
   * @return {boolean} true if other provider is the same as the receiver
   */
  equals(other) {
    return this === other;
  }

  /**
   * All supported base urls.
   * For github something like:
   * - git@github.com
   * - git://github.com
   * - git+ssh://github.com
   * - https://github.com
   * - git+https://github.com
   * @return {string[]} common base urls of all repositories
   */
  get repositoryBases() {
    return [this.name + ":"];
  }

  /**
   * Bring a repository name into its normal form by removing any clutter.
   * like .git suffix or #branch names.
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
   * Bring a group name into its normal form by removing any clutter.
   * like .git suffix or #branch names.
   * @param {string} name
   * @param {boolean} forLookup
   * @return {string} normalized name
   */
  normalizeGroupName(name, forLookup) {
    const { group } = this.parseName(name, "group");
    return group && forLookup && !this.areGroupNamesCaseSensitive
      ? group.toLowerCase()
      : group;
  }

  /**
   * Are repository names case sensitive.
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
   * Does the provider support the base name.
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
   * Parses repository name and tries to split it into
   * base, group, repository and branch.
   * @param {string} name
   * @param {string} focus where lies the focus if only one path component is given
   * @return {Object} with separated attributes
   */
  parseName(name, focus = "repository") {
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
      /^(git@[^:\/]+[:\/]|[\w\-^+]+:(\/\/[^\/]+\/)?)/,
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

    if (name.length) {
      const parts = name.split(/\//);

      if (parts.length >= 2) {
        const i = rightAligned ? parts.length - 2 : 0;
        result.group = parts[i];
        result.repository = parts[i + 1];
      } else {
        result[focus] = name;
      }
    }

    return result;
  }

  /**
   * Create a repository.
   * @param {string} name of group and repository
   * @param {Object} options
   * @returns {Promise<Repository>}
   */
  async createRepository(name, options) {
    const { group, repository } = this.parseName(name);
    const rg = await this.repositoryGroup(group);
    return rg.createRepository(repository, options);
  }

  /**
   * List provider objects of a given type.
   *
   * @param {string} type name of the method to deliver typed iterator projects,milestones,hooks,repositories,branches,tags
   * @param {string|string[]} patterns group / repository filter
   */
  async *list(type, patterns) {
    if (patterns === undefined) {
      for await (const group of this.repositoryGroups()) {
        yield* group[type]();
      }
    } else {
      for (const pattern of asArray(patterns)) {
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
   * List projects.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<Project>} all matching projects of the provider
   */
  async *projects(patterns) {
    yield* this.list("projects", patterns);
  }

  /**
   * List milestones.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<Milestone>} all matching milestones of the provider
   */
  async *milestones(patterns) {
    yield* this.list("milestones", patterns);
  }

  /**
   * List repositories.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<Repository>} all matching repos of the provider
   */
  async *repositories(patterns) {
    yield* this.list("repositories", patterns);
  }

  /**
   * List branches.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<Branch>} all matching branches of the provider
   */
  async *branches(patterns) {
    yield* this.list("branches", patterns);
  }

  /**
   * List tags.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<Tag>} all matching tags of the provider
   */
  async *tags(patterns) {
    yield* this.list("tags", patterns);
  }

  /**
   * List hooks.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<Hook>} all matching hooks of the provider
   */
  async *hooks(patterns) {
    yield* this.list("hooks", patterns);
  }

  /**
   * List pull requests.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<PullRequest>} all matching pullRequests of the provider
   */
  async *pullRequests(patterns) {
    yield* this.list("pullRequests", patterns);
  }

  /**
   * Deliver the provider name.
   * @return {string} class name by default
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * We are our own provider.
   * @return {BaseProvider} this
   */
  get provider() {
    return this;
  }

  /**
   * @return url of the provider.
   */
  get url() {
    return "/";
  }

  /**
   * List all defined entries from attributes.
   * return {object}
   */
  toJSON() {
    const json = { name: this.name };

    Object.entries(this.constructor.attributes).forEach(([k, v]) => {
      if (
        !v.private &&
        this[k] !== undefined &&
        typeof this[k] !== "function"
      ) {
        json[k] = this[k];
      }
    });

    return json;
  }

  initializeRepositories() {}

  trace(...args) {
    return this.messageDestination.trace(...args);
  }

  debug(...args) {
    return this.messageDestination.debug(...args);
  }

  info(...args) {
    return this.messageDestination.info(...args);
  }

  warn(...args) {
    return this.messageDestination.warn(...args);
  }

  error(...args) {
    return this.messageDestination.error(...args);
  }

  /**
   * @return {Function} repository group class used by the Provider
   */
  get repositoryGroupClass() {
    return RepositoryGroup;
  }

  /**
   * @return {Function} hook class used by the Provider
   */
  get hookClass() {
    return Hook;
  }

  /**
   * @return {Function} repository class used by the Provider
   */
  get repositoryClass() {
    return Repository;
  }

  /**
   * @return {Function} branch class used by the Provider
   */
  get branchClass() {
    return Branch;
  }

  /**
   * @return {Function} branch class used by the Provider
   */
  get tagClass() {
    return Tag;
  }

  /**
   * @return {Function} entry class used by the Provider
   */
  get entryClass() {
    return undefined;
  }

  /**
   * @return {Function} pull request class used by the Provider
   */
  get pullRequestClass() {
    return PullRequest;
  }
}
