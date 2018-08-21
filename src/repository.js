import { notImplementedError } from "./util";
import { OneTimeInititalizerMixin } from "./one-time-initializer-mixin";

/**
 * Abstract repository
 * @param {Owner} owner
 * @param {string} name (#branch) will be removed
 * @param {Object} options
 * @param {string} [options.description] human readable description
 * @param {string} [options.id] internal id
 *
 * @property {Owner} owner
 * @property {string} name without (#branch)
 * @property {string} [description] from options.description
 * @property {string} [id] from options.id
 * @property {Map<string,Branch>} branches
 * @property {Map<string,PullRequest>} pullRequests
 */
export const Repository = OneTimeInititalizerMixin(
  class Repository {
    /**
     * options
     */
    static get defaultOptions() {
      return {
        /**
         * the description of the repository content.
         * @return {string}
         */
        description: undefined,

        /**
         * unique id within the provider.
         * @return {string}
         */
        id: undefined
      };
    }

    constructor(owner, name, options) {
      name = name.replace(/#.*$/, "");

      const properties = {
        name: { value: name },
        owner: { value: owner },
        _branches: { value: new Map() },
        _pullRequests: { value: new Map() }
      };

      const defaultOptions = this.constructor.defaultOptions;

      Object.keys(defaultOptions).forEach(name => {
        properties[name] = {
          value:
            (options !== undefined && options[name]) || defaultOptions[name]
        };
      });

      Object.defineProperties(this, properties);
    }

    /**
     * the owners provider
     * @return {Provider}
     */
    get provider() {
      return this.owner.provider;
    }

    /**
     * Lookup content form the default branch
     * {@link Branch#content}
     * @return {Content}
     */
    async content(...args) {
      return (await this.defaultBranch).content(...args);
    }

    /**
     * urls to access the repo
     * @return {string[]}
     */
    get urls() {
      return [];
    }

    /**
     * preffered url to access the repo
     * @return {string}
     */
    get url() {
      return this.urls[0];
    }

    /**
     * the url of issue tracking system.
     * @return {string}
     */
    get issuesURL() {
      return undefined;
    }

    /**
     * the url of home page.
     * @return {string}
     */
    get homePageURL() {
      return undefined;
    }

    /**
     * Repository project
     * Default implementation delivers undefined
     * @return {string} undefined
     */
    get project() {
      return undefined;
    }

    /**
     * Name without project / owner
     * @return {string} name
     */
    get condensedName() {
      return this.name;
    }

    /**
     * Lookup branch by name
     * @param {string} name
     * @return {Promise<Branch>}
     */
    async branch(name) {
      return this._branches.get(name);
    }

    /**
     * Lookup the default branch
     * @return {Promise<Branch>} 'master' branch
     */
    get defaultBranch() {
      return this.branch("master");
    }

    /**
     * @return {Promise<Map>} of all branches
     */
    async branches() {
      return this._branches;
    }

    /**
     * Create a new {@link Branch} by cloning a given source branch
     * @param {string} name
     * @param {Branch} source branch defaults to master
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch
     */
    async createBranch(name, source, options) {
      const branch = new this.provider.branchClass(this, name, options);
      await branch.initialize();
      this._branches.set(name, branch);
      return branch;
    }

    /**
     * Delete a {@link Branch}
     * @param {string} name
     * @return {Promise<undefined>}
     */
    async deleteBranch(name) {
      this._branches.delete(name);
    }

    /**
     * Add a branch
     * @param {Branch} branch
     * @return {Promise<undefined>}
     */
    async addBranch(branch) {
      this._branches.set(branch.name, branch);
    }

    /**
     * Delete the repository from the {@link Provider}.
     * {@link Provider#deleteRepository}
     * @return {Promise<undefined>}
     */
    async delete() {
      return this.owner.deleteRepository(this.name);
    }

    async createPullRequest() {
      return notImplementedError();
    }

    /**
     * Deliver all {@link PullRequest}s
     * @return {Promise<Map>} of all pull requests
     */
    async pullRequests() {
      return this._pullRequests;
    }

    /**
     * The @{link PullRequest} for a given name
     * @param {string} name
     * @return {Promise<PullRequest>}
     */
    async pullRequest(name) {
      return this._pullRequests.get(name);
    }

    /**
     * Add a pull request
     * @param {PullRequest} pullRequest
     * @return {Promise}
     */
    async addPullRequest(pullRequest) {
      this._pullRequests.set(pullRequest.name, pullRequest);
    }

    /**
     * Delete a {@link PullRequest}
     * @param {string} name
     * @return {Promise}
     */
    async deletePullRequest(name) {
      this._pullRequests.delete(name);
    }

    /**
     * @return {string} providers type
     */
    get type() {
      return this.owner.type;
    }

    /**
     * Value delivered from the provider
     * @return {boolean} providers rateLimitReached
     */
    get rateLimitReached() {
      return this.provider.rateLimitReached;
    }

    /**
     * forward to the Provider
     * @param {boolean} value
     */
    set rateLimitReached(value) {
      this.provider.rateLimitReached(value);
    }

    async _initialize() {}
  }
);
