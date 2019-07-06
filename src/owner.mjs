import { RepositoryOwnerMixin } from "./owner-mixin.mjs";

/**
 * Collection of repositories
 * @property {Map<string,Repository>} repositories
 */
export const Owner = RepositoryOwnerMixin(
  class _Owner {
    get provider() {
      return this;
    }
  }
);
