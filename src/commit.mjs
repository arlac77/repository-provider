/**
 * @property {string} ref
 */
export class CommitResult {
  ref;

  constructor(ref) {
    this.ref = ref;
  }
}

export class User {}

/**
 * @property {Repository} repository
 * @property {string} message
 * @property {string} sha
 * @property {User} author
 * @property {User} committer
 */
export class Commit {
  repository;

  constructor(repository) {
    this.repository = repository;
  }
}
