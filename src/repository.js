import { notImplementedError } from "./util";
import { OneTimeInititalizerMixin } from "./one-time-initializer-mixin";
import { propertiesFromOptions } from "./util";

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

      propertiesFromOptions(
        properties,
        options,
        this.constructor.defaultOptions
      );

      Object.defineProperties(this, properties);
    }

    /**
     * full repository name within the provider
     * @return {string} full repo name
     */
    get fullName() {
      return this.name;
    }

    /**
     * the owners provider
     * @return {Provider}
     */
    get provider() {
      return this.owner.provider;
    }

    /**
     * Lookup content form the head of the default branch
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
     * Name without owner
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
    async branch(name, options) {
      await this.initialize();
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
      await this.initialize();
      return this._branches;
    }

    /**
     * Create a new {@link Branch} by cloning a given source branch
     * @param {string} name
     * @param {Branch} source branch defaults to master
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch (or already present old one with the same name)
     */
    async createBranch(name, source, options) {
      await this._initialize();
      let branch = this._branches.get(name);
      if (branch === undefined) {
        branch = await this._createBranch(name, source, options);
      }

      return branch;
    }

    /**
     * internal branch creation does no initialization
     * Create a new {@link Branch} by cloning a given source branch
     * @param {string} name
     * @param {Branch} source branch defaults to master
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch
     */
    async _createBranch(name, source, options) {
      const branch = new this.branchClass(this, name, options);
      this._branches.set(branch.name, branch);
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
      await this.initialize();
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
     * Get sha of a ref
     * @param {string} ref
     * @return {string} sha of the ref
     */
    async refId(ref) {
      return undefined;
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

    /**
     * By default we use the providers implementation.
     * @return {Class} as defined in the provider
     */
    get repositoryClass() {
      return this.provider.repositoryClass;
    }

    /**
     * By default we use the providers implementation.
     * @return {Class} as defined in the provider
     */
    get pullRequestClass() {
      return this.provider.pullRequestClass;
    }

    /**
     * By default we use the providers implementation.
     * @return {Class} as defined in the provider
     */
    get branchClass() {
      return this.provider.branchClass;
    }

    /**
     * By default we use the providers implementation.
     * @return {Class} as defined in the provider
     */
    get contentClass() {
      return this.provider.contentClass;
    }
  }
);
