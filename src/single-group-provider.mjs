import { BaseProvider } from "./base-provider.mjs";
import RepositoryOwner from "./repository-owner.mjs";

/**
 * Provider with a single set of repositories
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

  async branch(name) {
    const { repository, branch } = this.parseName(name);
    const r = await super.repository(repository);

    return r === undefined
      ? undefined
      : r.branch(
          branch === undefined ? repository.defaultBranchName : branch
        );
  }


  /**
   * List groups
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
