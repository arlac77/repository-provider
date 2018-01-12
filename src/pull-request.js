/**
 * Abstract pull request
 * @param {Repositoy} repository
 * @param {string} name
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.state
 *
 * @property {string} name
 * @property {Repository} repository
 * @property {string} [title]
 * @property {string} [state]
 */
export class PullRequest {
  constructor(repository, name, options = {}) {
    Object.defineProperties(
      this,
      ['title', 'state'].reduce(
        (a, key) => {
          if (options[key] !== undefined) {
            a[key] = { value: options[key] };
          }
          return a;
        },
        {
          name: { value: name },
          repository: { value: repository }
        }
      )
    );
  }

  get provider() {
    return this.repository.provider;
  }

  async delete() {
    return this.repository.deletePullRequest(this.name);
  }
}
