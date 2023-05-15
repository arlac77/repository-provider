
/**
 * @typedef {Object} CommitResult
 * @property {string} ref
 */

export class User
{

}

/**
 * @property {Repository} repository
 * @property {string} message
 * @property {string} sha
 * @property {User} author
 * @property {User} committer
 */
export class Commit {
  constructor(repository) {
    this.repository = repository;
  }
}
