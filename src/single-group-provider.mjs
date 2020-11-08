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
    const { repository } = this.parseName(name);
    return await super.repository(repository);
  }


  /**
   * get a single Group
   * @param {string} name
   * @return {RepositoryGroup} deliver the one and only present group
   */
  async repositoryGroup(name) {
    return name === undefined ? undefined : this;
  }

  /**
   * List groups
   * @param {string[]|string} patterns
   * @return {Iterator<RepositoryGroup>} always deliver the one and only present group
   */
  async *repositoryGroups(patterns) {
    yield this;
  }
}
