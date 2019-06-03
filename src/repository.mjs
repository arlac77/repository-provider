import { OneTimeInititalizerMixin } from "./one-time-initializer-mixin.mjs";
import { definePropertiesFromOptions, optionJSON } from "./util.mjs";

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
        id: undefined,

        /**
         * The name of the default branch
         * @return {string}
         */
        defaultBranchName: "master"
      };
    }

    constructor(owner, name, options) {
      name = name.replace(/#.*$/, "");

      definePropertiesFromOptions(this, options, {
        name: { value: name },
        owner: { value: owner },
        _branches: { value: new Map() },
        _pullRequests: { value: new Map() },
        _hooks: { value: [] }
      });
    }

    /**
     * full repository name within the provider
     * @return {string} full repo name
     */
    get fullName() {
      return this.owner === this.provider || this.owner.name === undefined
        ? this.name
        : [this.owner.name, this.name].join("/");
    }

    /**
     * the owners provider
     * @return {Provider}
     */
    get provider() {
      return this.owner.provider;
    }

    /**
     * Lookup entries form the head of the default branch
     * {@link Branch#entry}
     * @return {Entry}
     */
    async entry(name) {
      return (await this.defaultBranch).entry(name);
    }

    /**
     * List entries of the default branch
     * @param {string[]} matchingPatterns
     * @return {Entry} all matching entries in the branch
     */
    async *entries(...args) {
      yield* (await this.defaultBranch).entries(...args);
    }

    /**
     * get exactly one matching entry by name or undefine if no such entry is found
     * @param {string} name
     * @return {Promise<Entry>}
     */
    async maybeEntry(name) {
      return (await this.defaultBranch).maybeEntry(name);
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
    async branch(name) {
      await this.initialize();
      return this._branches.get(name);
    }

    /**
     * Lookup the default branch
     * @return {Promise<Branch>} branch named after defaultBranchName
     */
    get defaultBranch() {
      return this.branch(this.defaultBranchName);
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
     * @param {Branch} source branch defaults to the defaultBranch
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch (or already present old one with the same name)
     */
    async createBranch(name, source, options) {
      await this.initialize();
      let branch = this._branches.get(name);
      if (branch === undefined) {
        branch = await this._createBranch(
          name,
          source === undefined ? await this.defaultBranch : source,
          options
        );
        this._branches.set(branch.name, branch);
      }

      return branch;
    }

    /**
     * Create a new {@link Branch} by cloning a given source branch
     * All repository implementations must provide a repository._createBranch() to handle the real branch creation.
     * This methos MUST NOT be called by application code directly. It should be implemented by child classes, and called by the internal class methods only.
     * Internal branch creation does not call repository.initialize()
     * @param {string} name
     * @param {Branch} source branch defaults to the defaultBranch
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch
     */
    async _createBranch(name, source, options) {
      return new this.branchClass(this, name, options);
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

    async createPullRequest(name, source, options) {
      await this.initialize();
      let pr = this._pullRequests.get(name);
      if (pr === undefined) {
        pr = await this._createPullRequest(name, source, options);
        this._pullRequests.set(pr.name, pr);
      }

      return pr;
    }

    async _createPullRequest(name, source, options) {
      return new this.pullRequestClass(name, source, this, options);
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
     * Add a hook
     * @param {Hook} hook
     * @return {Promise}
     */
    async addHook(hook) {
      this._hooks.push(hook);
    }

    /**
     * List hooks
     * @param {string} filter
     * @return {Hook} all matching hook of the repository
     */
    async *hooks() {}

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
    get entryClass() {
      return this.provider.entryClass;
    }

    /**
     * By default we use the providers implementation.
     * @return {Class} as defined in the provider
     */
    get hookClass() {
      return this.provider.hookClass;
    }

    toString() {
      return this.name;
    }

    /**
     * provide name and all defined defaultOptions
     */
    toJSON() {
      return optionJSON(this, {
        name: this.name,
        fullName: this.fullName,
        urls: this.urls
      });
    }
  }
);
