import { Repository } from './repository';

/**
 * @property {Map<string,Repository>} repositories
 */
export class Owner {
  constructor() {
    Object.defineProperties(this, {
      repositories: { value: new Map() }
    });
  }

  /**
   * @return {Class} repository class used by the Provider
   */
  get repositoryClass() {
    return Repository;
  }

  /**
   * Delete a repository
   * @param {string} name
   * @return {Promise<undefined>}
   */
  async deleteRepository(name) {
    await this._initialize();
    this.repositories.delete(name);
  }

  /**
   * Lookup a repository
   * @param {string} name
   * @return {Promise<Repository>}
   */
  async repository(name) {
    await this._initialize();
    return this.repositories.get(name);
  }

  /**
   * Create a new repository
   * @param {string} name
   * @param {Object} options
   * @return {Promise<Repository>}
   */
  async createRepository(name, options) {
    await this._initialize();
    const repository = new this.repositoryClass(this, name, options);
    await repository.initialize();
    this.repositories.set(name, repository);
    return repository;
  }

  /**
   * Lookup a branch
   * First lookup repository then the branch
   * If no branch was specified then the default branch will be delivered.
   * @see {@link Repository#defaultBranch}
   * @param {string} name with optional branch name as '#myBranchName'
   * @return {Promise<Branch>}
   */
  async branch(name) {
    if (name === undefined) {
      return undefined;
    }

    await this._initialize();
    const [repoName, branchName] = name.split(/#/);
    let repository;

    if (branchName !== undefined) {
      repository = await this.repository(repoName);
      if (repository !== undefined) {
        return repository.branch(branchName);
      }
    }

    repository = await this.repository(repoName);

    if (repository === undefined) {
      throw new Error(`Unknown repository ${repoName}`);
    }

    return repository.defaultBranch;
  }

  async _initialize() {
    if (this._isInitialized) {
      return;
    }
    this._isInitialized = true;
    await this.initialize();
  }

  /**
   * Provider initialization
   * will be called once before content addressing method is called
   * @see {@link Provider#repository}
   * @see {@link Provider#branch}
   * @see {@link Provider#createRepository}
   * @see {@link Provider#deleteRepository}
   * @return {Promise<undefined>}
   */
  async initialize() {}

  /**
   * Deliver the repository type
   * @return {string} 'git'
   */
  get type() {
    return 'git';
  }
}
