import { addType } from "pacc";
import { Repository } from "./repository.mjs";

/**
 * @property {string} ref
 */
export class CommitResult {
  ref;

  static {
    addType(this);
  }

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
  static {
    addType(this);
  }

  repository;

  /**
   *
   * @param {Repository} repository
   * @param {Object} options
   * @param {string} options.sha
   * @param {string} options.message
   * @param {string} options.author
   * @param {string} options.committer
   */
  constructor(repository, options) {
    this.repository = repository;
    Object.assign(this, options);
  }
}
