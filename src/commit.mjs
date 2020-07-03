/**
 * @property {Repository} repository
 * @property {string} message
 * @property {string} sha
 */
export class Commit {
  constructor(repository) {
    Object.defineProperties(this, { repository: { value: repository } });
  }
}
