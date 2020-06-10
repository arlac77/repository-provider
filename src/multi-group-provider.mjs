import { matcher } from "matching-iterator";
import { BaseProvider } from "./base-provider.mjs";

/**
 * Provider supporting serveral repository groups
 *
 */
export class MultiGroupProvider extends BaseProvider {
  constructor(options) {
    super(options, {
      _repositoryGroups: { value: new Map() }
    });
  }

  /**
   * Lookup a repository group
   * @param {string} name of the group
   * @return {Promise<RepositoryGroup>}
   */
  async repositoryGroup(name) {
    await this.initializeRepositories();
    return this._repositoryGroups.get(this.normalizeGroupName(name, true));
  }

  /**
   * List groups
   * @param {string[]|string} patterns
   * @return {Iterator<RepositoryGroup>} all matching repositories groups of the provider
   */
  async *repositoryGroups(patterns) {
    await this.initializeRepositories();
    yield* matcher(this._repositoryGroups.values(), patterns, {
      caseSensitive: this.areGroupNamesCaseSensitive,
      name: "name"
    });
  }

  /**
   * Create a new repository group
   * If there is already a group for the given name it will be returend instead
   * @param {string} name of the group
   * @param {Object} options
   * @return {Promise<RepositoryGroup>}
   */
  async createRepositoryGroup(name, options) {
    return this.addRepositoryGroup(name, options);
  }

  /**
   * Add a new repository group (not provider specific actions are executed)
   * @param {string} name of the group
   * @param {Object} options
   * @return {RepositoryGroup}
   */
  addRepositoryGroup(name, options) {
    const normalizedName = this.normalizeGroupName(name, true);

    let repositoryGroup = this._repositoryGroups.get(normalizedName);
    if (repositoryGroup === undefined) {
      repositoryGroup = new this.repositoryGroupClass(this, name, options);
      this._repositoryGroups.set(normalizedName, repositoryGroup);
    }
    return repositoryGroup;
  }

}
