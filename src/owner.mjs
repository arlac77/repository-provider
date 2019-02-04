
import { RepositoryOwnerMixin } from './owner-mixin';

/**
 * Collection of repositories
 * @property {Map<string,Repository>} repositories
 */
export const Owner = RepositoryOwnerMixin(class _Owner {});
