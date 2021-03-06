import { asArray, stripBaseName } from "./util.mjs";
import { definePropertiesFromOptions } from "./attribute.mjs";
import { PullRequest } from "./pull-request.mjs";
import { RepositoryGroup } from "./repository-group.mjs";
import { Repository } from "./repository.mjs";
import { Branch } from "./branch.mjs";
import { Hook } from "./hook.mjs";

/**
 * @typedef {Object} MessageDestination
 * @param {Function} info
 * @param {Function} warn
 * @param {Function} error
 */

/**
 * @property {MessageDestination} messageDestination
 */
export class BaseProvider {
  /**
   * @return {string} identifier for environment options
   */
  static get instanceIdentifier() {
    return "";
  }

  /**
   * Extract options suitable for the constructor
   * form the given set of environment variables.
   * @param {Object} env taken from process.env
   * @param {string} instanceIdentifier
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
            options[name] = value;
            Object.assign(options, attribute.additionalAttributes);
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
      /**
       * In case there are several provider able to support a given source which one sould be used ?
       * this defines the order
       */
      priority: {
        type: "number",
        default: 0
      },

      name: {
        type: "string"
      },

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
   * @param {string?} options.instanceIdentifier
   * @param {Object} env taken from process.env
   * @return {Provider} newly created provider or undefined if options are not sufficient to construct a provider
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
   * All possible base urls.
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
   * Bring a repository name into its normal form by removing any clutter
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
   * Bring a group name into its normal form by removing any clutter
   * like .git suffix or #branch names.
   * @param {string} name
   * @param {boolean} forLookup
   * @return {string} normalized name
   */
  normalizeGroupName(name, forLookup) {
    const { group } = this.parseName(name, true);
    return group && forLookup && !this.areGroupNamesCaseSensitive
      ? group.toLowerCase()
      : group;
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
   * @param {boolean} groupFocus if only one path component is given
   * @return {Object} with separated attributes
   */
  parseName(name, groupFocus = false) {
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
        if (groupFocus) {
          result.group = name;
        } else {
          result.repository = name;
        }
      }
    }

    return result;
  }

  async createRepository(name, options) {
    const { group, repository } = this.parseName(name);
    const rg = await this.repositoryGroup(group);
    return rg.createRepository(repository, options);
  }

  /**
   * List provider objects of a given type.
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
   * List Projects.
   * @param {string[]|string} patterns
   * @return {Iterator<Projects>} all matching projects of the provider
   */
  async *projects(patterns) {
    yield* this.list("projects", patterns);
  }

  /**
   * List repositories.
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repos of the provider
   */
  async *repositories(patterns) {
    yield* this.list("repositories", patterns);
  }

  /**
   * List branches.
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching branches of the provider
   */
  async *branches(patterns) {
    yield* this.list("branches", patterns);
  }

  /**
   * List tags.
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
   * Deliver the provider name.
   * @return {string} class name by default
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * We are our own provider.
   * @return {Provider} this
   */
  get provider() {
    return this;
  }

  toString() {
    return this.name;
  }

  /**
   * List all defined entries from attributes.
   * return {object}
   */
  toJSON() {
    const json = { name: this.name };

    Object.entries(this.constructor.attributes).forEach(([k,v]) => {
      if (!v.private && this[k] !== undefined && typeof this[k] !== "function") {
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

  info(...args) {
    return this.messageDestination.info(...args);
  }

  warn(...args) {
    return this.messageDestination.warn(...args);
  }

  error(...args) {
    return this.messageDestination.error(...args);
  }
}
