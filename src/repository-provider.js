function notImplementedError() {
  return new Error('not implemented');
}

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} config
 */
export class Provider {
  /**
   * @return {Class} repository class used by the Provider
   */
  static get repositoryClass() {
    return Repository;
  }

  /**
   * @return {Class} branch class used by the Provider
   */
  static get branchClass() {
    return Branch;
  }

  /**
   * @return {Class} pull request class used by the Provider
   */
  static get pullRequestClass() {
    return PullRequest;
  }

  static config(config) {
    return Object.assign({}, config);
  }

  constructor(config) {
    Object.defineProperties(this, {
      config: {
        value: this.constructor.config(config)
      },
      repositories: { value: new Map() }
    });
  }

  async repository(name) {
    let r = this.repositories.get(name);
    if (r === undefined) {
      r = new this.constructor.repositoryClass(this, name);
      await r.initialize();
      this.repositories.set(name, r);
    }

    return r;
  }

  /**
   * Is our rate limit reached
   * by default we have no rate limit
   * @return {boolean} false
   */
  get rateLimitReached() {
    return false;
  }
}

/**
 * Abstract repository
 * @param {Provider} provider
 * @param {string} name
 */
export class Repository {
  constructor(provider, name) {
    Object.defineProperties(this, {
      name: { value: name },
      provider: { value: provider },
      _branches: { value: new Map() },
      _pullRequests: { value: new Map() }
    });
  }

  async initialize() {}

  async content(...args) {
    const branch = await this.branch('master');
    return branch.content(...args);
  }

  async branch(name) {
    let b = this._branches.get(name);
    if (b === undefined) {
      b = new this.provider.constructor.branchClass(this, name);
      this._branches.set(name, b);
    }

    return b;
  }

  /**
   * @return {Map} of all branches
   */
  async branches() {
    return this._branches;
  }

  async createBranch(name) {
    return notImplementedError();
  }

  async deleteBranch(name) {
    return notImplementedError();
  }

  async createPullRequest() {
    return notImplementedError();
  }

  /**
   * @return {Map} of all pull requests
   */
  async pullRequests() {
    return this._pullRequests;
  }

  async deletePullRequest(name) {
    return notImplementedError();
  }

  /**
   * forward to the Provider
   */
  get rateLimitReached() {
    return this.provider.rateLimitReached;
  }

  /**
   * forward to the Provider
   */
  set rateLimitReached(value) {
    this.provider.rateLimitReached(value);
  }
}

/**
 * Abstract git branch
 * @param {Repository} repository
 * @param {string} name
 */
export class Branch {
  constructor(repository, name = 'master') {
    Object.defineProperties(this, {
      name: { value: name },
      repository: { value: repository }
    });
  }

  get provider() {
    return this.repository.provider;
  }

  delete() {
    return this.repository.deleteBranch(this.name);
  }

  async content(path) {
    return notImplementedError();
  }

  /**
   * Commit files
   * @arg {string} message commit message
   * @arg {Object} updates file content to be commited
   * @arg {Object} options
   */
  async commit(message, updates, options) {
    return notImplementedError();
  }

  async createPullRequest(toBranch, msg) {
    return notImplementedError();
  }

  async list() {
    return [];
  }

  /**
   * forward to the Provider
   */
  get rateLimitReached() {
    return this.provider.rateLimitReached;
  }

  /**
   * forward to the Provider
   */
  set rateLimitReached(value) {
    this.provider.rateLimitReached(value);
  }
}

/**
 * Abstract pull request
 * @param {Repositoy} repository
 * @param {string} name
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.state
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

  delete() {
    return this.repository.deletePullRequest(this.name);
  }
}
