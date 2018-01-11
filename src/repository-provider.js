function notImplementedError() {
  return new Error('not implemented');
}

/**
 * Base repository provider acts as a source of repositories
 * @param {Object} options
 * @property {Map} repositories
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

  /**
   * Default configuration options
   * @return {Object}
   */
  static get defaultOptions() {
    return {};
  }

  /**
   * Pepare configuration by mixing together defaultOptions with actual options
   * @param {Object} config
   * @return {Object} combined options
   */
  static options(config) {
    return Object.assign(this.defaultOptions, config);
  }

  constructor(options) {
    Object.defineProperties(this, {
      config: {
        value: this.constructor.options(options)
      },
      repositories: { value: new Map() }
    });
  }

  /**
   * @param {string} name
   * @return {Repository}
   */
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
 * @property {Provider} provider
 * @property {string} name
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

  /**
   * Create a new branch
   * @param {string} name
   */
  async createBranch(name) {
    return notImplementedError();
  }

  /**
   * Delete a branch
   * @param {string} name
   */
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
 * @property {Repository} repository
 * @property {string} name
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

  /**
   * Delete the branch
   * forwarded to the repository
   */
  delete() {
    return this.repository.deleteBranch(this.name);
  }

  /**
   * Deliver file content
   * @param {string} path
   * @return {string|Buffer} content os a given file
   */
  async content(path) {
    return notImplementedError();
  }

  /**
   * Commit files
   * @param {string} message commit message
   * @param {Object} updates file content to be commited
   * @param {Object} options
   */
  async commit(message, updates, options) {
    return notImplementedError();
  }

  /**
   * Create a pull request
   * @param {Branch} toBranch
   * @param {string} message
   */
  async createPullRequest(toBranch, message) {
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
