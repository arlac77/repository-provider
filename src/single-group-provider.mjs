import { BaseProvider } from "./base-provider.mjs";
import RepositoryOwner from "./repository-owner.mjs";

/**
 * Provider with a single set of repositories
 */
export class SingleGroupProvider extends RepositoryOwner(BaseProvider) {

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
