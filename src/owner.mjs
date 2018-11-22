import { Repository } from "./repository";
import { Branch } from "./branch";
import { Entry } from "./entry";
import { PullRequest } from "./pull-request";
import { OneTimeInititalizerMixin } from "./one-time-initializer-mixin";
import { LogLevelMixin } from 'loglevel-mixin/src/loglevel-mixin.mjs';

/**
 * Collection of repositories
 * @property {Map<string,Repository>} repositories
 */
export const Owner = LogLevelMixin(OneTimeInititalizerMixin(
  class Owner {
    /**
     * options
     */
    static get defaultOptions() {
      return {
        /**
         * default logger
         */
        logger: (...arg) => console.log(...args)
      };
    }

    constructor() {
      Object.defineProperties(
        this,
        {
          repositories: { value: new Map() }
        }
      );
    }

    /**
     * @return {Class} repository class used by the Provider
     */
    get repositoryClass() {
      return Repository;
    }

    /**
     * @return {Class} branch class used by the Provider
     */
    get branchClass() {
      return Branch;
    }

    /**
     * @return {Class} entry class used by the Provider
     */
    get entryClass() {
      return Entry;
    }

    /**
     * @return {Class} pull request class used by the Provider
     */
    get pullRequestClass() {
      return PullRequest;
    }

    /**
     * Delete a repository
     * @param {string} name
     * @return {Promise<undefined>}
     */
    async deleteRepository(name) {
      await this.initialize();
      this.repositories.delete(name);
    }

    /**
     * Lookup a repository
     * @param {string} name of the repository may contain a #branch
     * @return {Promise<Repository>}
     */
    async repository(name, options) {
      if (name === undefined) {
        return undefined;
      }

      const [repoName, branchName] = name.split(/#/);

      await this.initialize();
      return this.repositories.get(repoName);
    }

    /**
     * Create a new repository
     * @param {string} name
     * @param {Object} options
     * @return {Promise<Repository>}
     */
    async createRepository(name, options) {
      await this.initialize();
      const repository = new this.repositoryClass(this, name, options);
      this.repositories.set(repository.name, repository);
      return repository;
    }

    /**
     * Lookup a branch
     * First lookup repository then the branch
     * If no branch was specified then the default branch will be delivered.
     * @see {@link Repository#defaultBranch}
     * @param {string} name with optional branch name as '#myBranchName'
     * @return {Promise<Branch|undefined>}
     */
    async branch(name, options) {
      if (name === undefined) {
        return undefined;
      }

      const [repoName, branchName] = name.split(/#/);
      const repository = await this.repository(repoName);

      if (repository === undefined) {
        return undefined;
      }

      return branchName === undefined
        ? repository.defaultBranch
        : repository.branch(branchName);
    }

    /**
     * Deliver the repository type
     * @return {string} 'git'
     */
    get type() {
      return "git";
    }

    async _initialize() {}
  }
));
