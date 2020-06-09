import { BaseProvider } from "./base-provider.mjs";
import RepositoryOwner from "./repository-owner.mjs";

export class SingleGroupProvider extends RepositoryOwner(BaseProvider) {

  async repositoryGroup(name) {
    return name === undefined ? undefined : this;
  }

  /**
   * List groups
   * @param {string[]|string} patterns
   * @return {Iterator<RepositoryGroup>} all matching repositories groups of the provider
   */
  async *repositoryGroups() {
    yield this;
  }
}
