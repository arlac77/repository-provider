import { matcher } from "matching-iterator";
import { BaseProvider } from "./base-provider.mjs";
import { stripBaseNames } from "./util.mjs";
import { Repository } from "./repository.mjs";
import { Branch } from "./branch.mjs";
import { RepositoryGroup } from "./repository-group.mjs";

/**
 * Provider supporting serveral repository groups.
 *
 */
export class MultiGroupProvider extends BaseProvider {

  #repositoryGroups = new Map();

  /**
   * Lookup a repository in the provider and all of its repository groups.
   * @param {string} name of the repository
   * @return {Promise<Repository|undefined>}
   */
  async repository(name) {
    const { base, group, repository } = this.parseName(name);

    if (this.supportsBase(base)) {
      if (group !== undefined) {
        const rg = await this.repositoryGroup(group);

        if (rg !== undefined) {
          return await rg.repository(repository);
        }
      }
    }
  }

  /**
   * Lookup a branch.
   * @param {string} name of the branch
   * @return {Promise<Branch|undefined>}
   */
  async branch(name) {
    const { base, group, repository, branch } = this.parseName(name);

    if (this.supportsBase(base)) {
      if (group !== undefined) {
        const rg = await this.repositoryGroup(group);

        if (rg !== undefined) {
          const r = await rg.repository(repository);
          if (r !== undefined) {
            return r.branch( branch || r.defaultBranchName);
          }
        }
      }
    }
  }

  /**
   * Lookup a repository group.
   * @param {string} name of the group
   * @return {Promise<RepositoryGroup|undefined>}
   */
  async repositoryGroup(name) {
    const { base } = this.parseName(name);

    if (this.supportsBase(base)) {
      await this.initializeRepositories();
      return this.#repositoryGroups.get(this.normalizeGroupName(stripBaseNames(name, this.provider.repositoryBases), true));
    }
  }

  /**
   * List groups.
   * @param {string[]|string} patterns
   * @return {AsyncIterator<RepositoryGroup>} all matching repositories groups of the provider
   */
  async *repositoryGroups(patterns) {
    await this.initializeRepositories();

    yield* matcher(
      this.#repositoryGroups.values(),
      stripBaseNames(patterns, this.provider.repositoryBases),
      {
        caseSensitive: this.areGroupNamesCaseSensitive,
        name: "name"
      }
    );
  }

  /**
   * Create a new repository group.
   * If there is already a group for the given name it will be returend instead
   * @param {string} name of the group
   * @param {Object} options
   * @return {Promise<RepositoryGroup>}
   */
  async createRepositoryGroup(name, options) {
    return this.addRepositoryGroup(name, options);
  }

  /**
   * Add a new repository group (not provider specific actions are executed).
   * @param {string} name of the group
   * @param {Object} options
   * @return {RepositoryGroup}
   */
  addRepositoryGroup(name, options) {
    return this.#repositoryGroups.get(this.normalizeGroupName(name, true)) || new this.repositoryGroupClass(this, name, options);
  }

  _addRepositoryGroup(repositoryGroup) {
    this.#repositoryGroups.set(this.normalizeGroupName(repositoryGroup.name, true), repositoryGroup);
  }
}
