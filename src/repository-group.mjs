import RepositoryOwner from "./repository-owner.mjs";
import { NamedObject } from "./named-object.mjs";
import { matcher } from "matching-iterator";
import { Branch } from "./branch.mjs";

/**
 * Abstract repository collection
 * @param {Provider} provider
 * @param {string} name of the group
 * @param {Object} options
 * @param {string} [options.description] human readable description
 * @param {string} [options.id] internal id
 * @param {string} [options.uuid] internal id
 * @param {string} [options.url] home
 *
 * @property {Provider} provider
 * @property {string} name
 */

export class RepositoryGroup extends RepositoryOwner(NamedObject) {
  static get attributes() {
    return {
      ...super.attributes,

      /**
       * Unique id.
       * @return {string}
       */
      uuid: undefined,

      /**
       * Type of the repository group either User or Organization.
       * @return {string}
       */
      type: undefined,

      /**
       * Group home.
       * @return {string}
       */
      url: undefined,

      /**
       * Avatar.
       * @return {string}
       */
      avatarURL: undefined
    };
  }

  /**
   * Map attributes between external and internal representation
   */
  static get attributeMapping() {
    return {};
  }

  constructor(provider, name, options) {
    super(name, options, {
      provider: { value: provider }
    });
  }

  get areRepositoryNamesCaseSensitive() {
    return this.provider.areRepositoryNamesCaseSensitive;
  }

  get areRepositoryGroupNamesCaseSensitive() {
    return this.provider.areRepositoryGroupNamesCaseSensitive;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get repositoryClass() {
    return this.provider.repositoryClass;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get branchClass() {
    return this.provider.branchClass;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get contentClass() {
    return this.provider.contentClass;
  }

  /**
   * By default we use the providers implementation.
   * @return {Class} as defined in the provider
   */
  get pullRequestClass() {
    return this.provider.pullRequestClass;
  }


  /**
   * Lookup a branch
   * First lookup repository then the branch
   * If no branch was specified then the default branch will be delivered.
   * @see {@link Repository#defaultBranch}
   * @param {string} name with optional branch name as '#myBranchName'
   * @return {Promise<Branch|undefined>}
   */
  async branch(name) {
    if (name === undefined) {
      return undefined;
    }

    const [repoName, branchName] = name.split(/#/);
    const repository = await this.repository(repoName);

    if (repository === undefined) {
      return undefined;
    }

    return branchName === undefined
      ? repository.defaultBranch
      : repository.branch(branchName);
  }

  /**
   * List branches for the owner
   * @param {string[]|string} patterns
   * @return {Iterator<Branch>} all matching branches of the owner
   */
  async *branches(patterns) {
    const [repoPatterns, branchPatterns] = patterns.split(/#/);

    await this.initializeRepositories();

    for (const name of matcher(this._repositories.keys(), repoPatterns, {
      caseSensitive: this.areRepositoriesCaseSensitive
    })) {
      const repository = this._repositories.get(name);
      const branch =
        branchPatterns === undefined
          ? repository.defaultBranch
          : repository.branch(branchPatterns);
      if (branch !== undefined) {
        yield branch;
      }
    }
  }

  async tag(name) {}

  async *tags(patterns) {}
}
