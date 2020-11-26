import { BaseProvider } from "./base-provider.mjs";
import { RepositoryOwner } from "./repository-owner.mjs";

/**
 * Provider holding a single set of repositories (no repository groups)
 */
export class SingleGroupProvider extends RepositoryOwner(BaseProvider) {
  /**
   * Lookup a repository in the provider and all of its repository groups
   * @param {string} name of the repository
   * @return {Repository}
   */
  async repository(name) {
    const { base, repository } = this.parseName(name);
    if (this.supportsBase(base)) {
      return await super.repository(repository);
    }
  }

  /**
   * Get a single Group
   * @param {string} name
   * @return {RepositoryGroup} deliver the one and only present group
   */
  async repositoryGroup(name) {
    if (name !== undefined) {
      const { base } = this.parseName(name);

      if (this.supportsBase(base)) {
        return this;
      }
    }
  }

  /**
   * List groups
   * @param {string[]|string} patterns
   * @return {Iterator<RepositoryGroup>} always deliver the one and only present group
   */
  async *repositoryGroups(patterns) {
    //yield this;
  }
}
