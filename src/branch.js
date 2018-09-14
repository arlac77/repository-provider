import { notImplementedError } from "./util";
import { OneTimeInititalizerMixin } from "./one-time-initializer-mixin";
import { propertiesFromOptions } from "./util";

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
      const properties = {
        name: { value: name },
        repository: { value: repository }
      };

      propertiesFromOptions(
        properties,
        options,
        this.constructor.defaultOptions
      );

      Object.defineProperties(this, properties);

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
     * Deliver file content from the head
     * @param {string} path
     * @return {Promise<Content>} content of a given file
     */
    async content(path) {
      throw new Error(`No such object '${path}'`);
    }

    /**
     * Commit files
     * @param {string} message commit message
     * @param {Content[]} updates file content to be commited
     * @param {Object} options
     * @return {Promise}
     */
    async commit(message, updates, options) {
      return notImplementedError();
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

    /**
     * List paths of the branch
     * @return {string[]} all file names in the branch
     */
    async *list(matchingPatterns) {}

    /**
     * Value delivered from the provider
     * @see {@link Provider#rateLimitReached}
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

    /**
     * By default we use the repository implementation.
     * @return {Class} as defined in the repository
     */
    get pullRequestClass() {
      return this.repository.pullRequestClass;
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
  }
);
