import { LogLevelMixin } from "loglevel-mixin";
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
export const Repository = LogLevelMixin(
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
         * unique id.
         * @return {string}
         */
        uuid: undefined,

        /**
         * The name of the default branch
         * @return {string}
         */
        defaultBranchName: "master",

        /**
         * urls of the repository
         * @return {string[]}
         */
        urls: undefined,

        isArchived: undefined,
        isLocked: undefined,
        isDisabled: undefined
      };
    }

    constructor(owner, name, options) {
      definePropertiesFromOptions(this, options, {
        name: { value: owner.normalizeRepositoryName(name, false) },
        owner: { value: owner },
        _branches: { value: new Map() },
        _tags: { value: new Map() },
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

    logger(...args) {
      this.provider.logger(...args);
    }

    /**
     * Check for equality
     * @param {Repository} other
     * @return {boolean} true if name and provider are equal
     */
    equals(other) {
      if (other === undefined) {
        return false;
      }

      return (
        this.fullName === other.fullName && this.provider.equals(other.provider)
      );
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
     * get exactly one matching entry by name or undefined if no such entry is found
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
     * by default we are not archived
     * @return {boolean} false
     */
    get isArchived() {
      return false;
    }

    /**
     * by default we are not locked
     * @return {boolean} false
     */
    get isLocked() {
      return false;
    }

    /**
     * by default we are not disabled
     * @return {boolean} false
     */
    get isDisabled() {
      return false;
    }

    /**
     * Lookup branch by name
     * @param {string} name
     * @return {Promise<Branch>}
     */
    async branch(name) {
      await this.initializeBranches();
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
    async *branches(patterns) {
      await this.initializeBranches();

      for (const name of this.owner.match(this._branches.keys(), patterns)) {
        yield this._branches.get(name);
      }
    }

    /**
     * Create a new {@link Branch} by cloning a given source branch
     * @param {string} name of the new branch
     * @param {Branch} source branch defaults to the defaultBranch
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch (or already present old one with the same name)
     */
    async createBranch(name, source, options) {
      await this.initializeBranches();
      return this.addBranch(name, options);
    }

    /**
     * Add a new {@link Branch}.
     * Internal branch creation does not call repository.initialize()
     * @param {string} name of the new branch
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch
     */
    addBranch(name, options) {
      let branch = this._branches.get(name);
      if (branch === undefined) {
        branch = new this.branchClass(this, name, options);
      }

      return branch;
    }

    _addBranch(branch) {
      this._branches.set(branch.name, branch);
    }

    /**
     * Delete a {@link Branch}
     * @param {string} name of the branch
     * @return {Promise<undefined>}
     */
    async deleteBranch(name) {
      this._branches.delete(name);
    }

    /**
     * @return {Iterator<String>} of all tags
     */
    async *tags(patterns) {
      await this.initializeTags();

      for (const name of this.owner.match(this._tags.keys(), patterns)) {
        yield this._tags.get(name);
      }
    }

    /**
     * @return {Iterator<String>} of all tags
     */
    async tag(name) {
      await this.initializeTags();
      return this._tags.get(name);
    }

    /**
     * Delete the repository from the {@link Provider}.
     * {@link Provider#deleteRepository}
     * @return {Promise<undefined>}
     */
    async delete() {
      return this.owner.deleteRepository(this.name);
    }

    /**
     * create a pull request (or deliver an already present for thefiven name)
     * @param {string} name of the pr
     * @param {Branch} source branch
     * @param {Object} options
     * @return {PullRequest}
     */
    async createPullRequest(name, source, options) {
      await this.initializePullRequests();
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
     * @return {Iterator<PullRequest>} of all pull requests
     */
    async *pullRequests() {
      await this.initializePullRequests();

      for (const pr of this._pullRequests.values()) {
        yield pr;
      }
    }

    /**
     * The @{link PullRequest} for a given name
     * @param {string} name
     * @return {Promise<PullRequest>}
     */
    async pullRequest(name) {
      await this.initializePullRequests();
      return this._pullRequests.get(name);
    }

    /**
     * Add a pull request
     * @param {PullRequest} pullRequest
     * @return {Promise}
     */
    async addPullRequest(pullRequest) {
      await this.initializePullRequests();
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
     */
    addHook(hook) {
      this._hooks.push(hook);
    }

    /**
     * Add a hook
     * @param {Hook} hook
     */
    async createHook(hook) {
      this.addHook(hook);
    }

    /**
     * List hooks
     * @param {string} filter
     * @return {Hook} all matching hook of the repository
     */
    async *hooks() {
      await this.initializeHooks();
      for (const hook of this._hooks) {
        yield hook;
      }
    }

    /**
     * @return {string} 'git'
     */
    get type() {
      return "git";
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
      return this.fullName;
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

    initialize() {}

    initializeHooks() {
      return this.initialize();
    }

    initializeBranches() {
      return this.initialize();
    }

    initializeTags() {
      return this.initialize();
    }

    async initializePullRequests() {
      for await (const pr of this.pullRequestClass.list(this)) {
        this._pullRequests.set(pr.name, pr);
      }
    }
  }
);
