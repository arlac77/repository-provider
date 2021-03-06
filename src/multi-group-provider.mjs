import { matcher } from "matching-iterator";
import { BaseProvider } from "./base-provider.mjs";
import { stripBaseNames } from "./util.mjs";

/**
 * Provider supporting serveral repository groups.
 *
 */
export class MultiGroupProvider extends BaseProvider {
  constructor(options) {
    super(options, {
      _repositoryGroups: { value: new Map() }
    });
  }

  /**
   * Lookup a repository in the provider and all of its repository groups.
   * @param {string} name of the repository
   * @return {Repository}
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

  async branch(name) {
    const { base, group, repository, branch } = this.parseName(name);

    if (this.supportsBase(base)) {
      if (group !== undefined) {
        const rg = await this.repositoryGroup(group);

        if (rg !== undefined) {
          const r = await rg.repository(repository);
          if (r !== undefined) {
            return r.branch(
              branch === undefined ? r.defaultBranchName : branch
            );
          }
        }
      }
    }
  }

  /**
   * Lookup a repository group.
   * @param {string} name of the group
   * @return {RepositoryGroup}
   */
  async repositoryGroup(name) {
    const { base } = this.parseName(name);

    if (this.supportsBase(base)) {
      name = stripBaseNames(name, this.provider.repositoryBases);
      await this.initializeRepositories();
      return this._repositoryGroups.get(this.normalizeGroupName(name, true));
    }
  }

  /**
   * List groups.
   * @param {string[]|string} patterns
   * @return {Iterator<RepositoryGroup>} all matching repositories groups of the provider
   */
  async *repositoryGroups(patterns) {
    await this.initializeRepositories();

    yield* matcher(
      this._repositoryGroups.values(),
      stripBaseNames(patterns,this.provider.repositoryBases),
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
   * @return {RepositoryGroup}
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
    const normalizedName = this.normalizeGroupName(name, true);

    let repositoryGroup = this._repositoryGroups.get(normalizedName);
    if (repositoryGroup === undefined) {
      repositoryGroup = new this.repositoryGroupClass(this, name, options);
      this._repositoryGroups.set(normalizedName, repositoryGroup);
    }
    return repositoryGroup;
  }
}
