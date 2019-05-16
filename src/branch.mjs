import { definePropertiesFromOptions, notImplementedError } from "./util.mjs";
import { OneTimeInititalizerMixin } from "./one-time-initializer-mixin.mjs";

/**
 * Abstract branch
 * @see {@link Repository#addBranch}
 * @param {Repository} repository
 * @param {string} name
 * @param {Object} options
 * @property {Repository} repository
 * @property {Provider} provider
 * @property {string} name
 */
export const Branch = OneTimeInititalizerMixin(
  class Branch {
    /**
     * options
     */
    static get defaultOptions() {
      return {};
    }

    constructor(repository, name = "master", options) {
      definePropertiesFromOptions(this, options, {
        name: { value: name },
        repository: { value: repository }
      });

      repository.addBranch(this);
    }

    /**
     * The provider we live in
     * @return {Provider}
     */
    get provider() {
      return this.repository.provider;
    }

    /**
     * Branch owner
     * By default we provide the repository owner
     * @see {@link Repository#owner}
     * @return {string}
     */
    get owner() {
      return this.repository.owner;
    }

    /**
     * Repository and branch name combined
     * @return {string} 'repo#branch'
     */
    get fullName() {
      return `${this.repository.fullName}#${this.name}`;
    }

    /**
     * Repository fullName and branch name combined.
     * But skipping the branch name if it is the default branch
     * @return {string} 'user/repo#branch'
     */
    get fullCondensedName() {
      return this.isDefault
        ? this.repository.fullName
        : `${this.repository.fullName}#${this.name}`;
    }

    toString() {
      return this.fullCondensedName;
    }

    /**
     * Deliver repository and branch url combined
     * @return {string} 'repoUrl#branch'
     */
    get url() {
      return this.isDefault
        ? this.repository.url
        : `${this.repository.url}#${this.name}`;
    }

    /**
     * Url of issue tracking system.
     * @see {@link Repository#issuesURL}
     * @return {string} as provided from the repository
     */
    get issuesURL() {
      return this.repository.issuesURL;
    }

    /**
     * Url of home page.
     * @see {@link Repository#homePageURL}
     * @return {string} as provided from the repository
     */
    get homePageURL() {
      return this.repository.homePageURL;
    }

    /**
     * Git branch ref name
     * @return {string} git ref of the branch
     */
    get ref() {
      return `refs/heads/${this.name}`;
    }

    /**
     * Are we the default branch
     * @return {boolean} true if name is 'master'
     */
    get isDefault() {
      return this.name === "master";
    }

    /**
     * Delete the branch from the {@link Repository}.
     * @see {@link Repository#deleteBranch}
     * @return {Promise<undefined>}
     */
    async delete() {
      return this.repository.deleteBranch(this.name);
    }

    /**
     * Commit files
     * @param {string} message commit message
     * @param {Entry[]} updates file content to be commited
     * @param {Object} options
     * @return {Promise}
     */
    async commit(message, updates, options) {
      return notImplementedError();
    }

    /**
     * List entries of the branch
     * @param {string[]} matchingPatterns
     * @return {Entry} all matching entries in the branch
     */
    async *entries(matchingPatterns) {}

    /**
     * List all entries of the branch
     * @return {Iterator<Entry>} all entries in the branch
     */
    async *[Symbol.iterator]() {
      return this.entries();
    }

    /**
     * get exactly one matching entry by name
     * @param {string} name
     * @return {Promise<Entry>}
     */
    async entry(name) {
      const e = (await this.entries(name).next()).value;
      if (e === undefined) {
        throw new Error(`No such entry '${name}'`);
      }
      return e;
    }

    async _initialize() {}

    /**
     * Get sha of a ref
     * @param {string} ref
     * @return {string} sha of the ref
     */
    async refId(ref = this.ref) {
      return this.repository.refId(ref);
    }

    /**
     * By default we use the providers implementation.
     * @return {Class} as defined in the repository
     */
    get entryClass() {
      return this.repository.entryClass;
    }

    /**
     * Create a pull request
     * @param {Branch} toBranch
     * @param {string} message
     * @return {Promise<PullRequest>}
     */
    async createPullRequest(toBranch, message) {
      return notImplementedError();
    }

    async addPullRequest(pullRequest) {
      return this.repository.addPullRequest(pullRequest);
    }

    async deletePullRequest(name) {
      return this.repository.deletePullRequest(name);
    }

    /**
     * By default we use the repository implementation.
     * @return {Class} as defined in the repository
     */
    get pullRequestClass() {
      return this.repository.pullRequestClass;
    }

    /**
     * Create a new {@link Branch} by cloning a given source branch
     * Simplay calls Repository.createBranch() with the receiver as source branch
     * @param {string} name
     * @param {Object} options
     * @return {Promise<Branch>} newly created branch (or already present old one with the same name)
     */
    async createBranch(name, options) {
      return this.repository.createBranch(name, this, options);
    }
  }
);
