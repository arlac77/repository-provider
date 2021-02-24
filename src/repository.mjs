import { matcher } from "matching-iterator";
import { optionJSON } from "./attribute.mjs";
import { NamedObject } from "./named-object.mjs";

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
export class Repository extends NamedObject {
  /**
   * options
   */
  static get attributes() {
    return {
      ...super.attributes,

      /**
       * The name of the default branch
       * @return {string}
       */
      defaultBranchName: { type: "string", default: "master" },

      /**
       * URLs of the repository
       * @return {string[]}
       */
      urls: {},

      cloneURL: { type: "url" },

      /**
       * The url of home page.
       * @return {string}
       */
      homePageURL: { type: "url" },

      /**
       * The url of issue tracking system.
       * @return {string}
       */
      issuesURL: { type: "url" },
      size: { type: "integer" },
      language: { type: "string" },
      isArchived: { type: "boolean", default: false },
      isLocked: { type: "boolean", default: false },
      isDisabled: { type: "boolean", default: false },
      isTemplate: { type: "boolean", default: false },
      isFork: { type: "boolean", default: false }
    };
  }

  constructor(owner, name, options) {
    super(owner.normalizeRepositoryName(name, false), options, {
      owner: { value: owner },
      _branches: { value: new Map() },
      _tags: { value: new Map() },
      _pullRequests: { value: new Map() },
      _milestones: { value: new Map() },
      _hooks: { value: [] }
    });
  }

  /**
   * Full repository name within the provider
   * @return {string} full repo name
   */
  get fullName() {
    return this.owner === this.provider ||
      this.owner.name === undefined ||
      this.owner.name === ""
      ? this.name
      : [this.owner.name, this.name].join("/");
  }

  /**
   * url name of the repo
   * @return {string}
   */
  get slug() {
    return `${this.owner.name}/${this.name}`;
  }

  /**
   * The owners provider
   * @return {Provider}
   */
  get provider() {
    return this.owner.provider;
  }

  /**
   * Short human readable identifier with provider and branch.
   * @return {string}
   */
  get identifier() {
    return `${this.provider.name}:${this.fullName}`;
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
  async *entries(matchingPatterns) {
    yield* (await this.defaultBranch).entries(matchingPatterns);
  }

  /**
   * Get exactly one matching entry by name or undefined if no such entry is found
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
   * Preffered url to access the repo
   * @return {string}
   */
  get url() {
    return this.urls[0];
  }

  /**
   * The url used fro cloning the repo.
   * @return {string}
   */
  get cloneURL() {
    return this.url;
  }

  /**
   * The url of issue tracking system.
   * @return {string}
   */
  get issuesURL() {
    return undefined;
  }

  /**
   * The url of home page.
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
   * By default we are not archived
   * @return {boolean} false
   */
  get isArchived() {
    return false;
  }

  /**
   * By default we are not locked
   * @return {boolean} false
   */
  get isLocked() {
    return false;
  }

  /**
   * By default we are not disabled
   * @return {boolean} false
   */
  get isDisabled() {
    return false;
  }

  /**
   * By default we are not a template
   * @return {boolean} false
   */
  get isTemplate() {
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
   * @return {Iterator<Branch>} of all branches
   */
  async *branches(patterns) {
    await this.initializeBranches();
    yield* matcher(this._branches.values(), patterns, {
      name: "name"
    });
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

  _addTag(tag) {
    this._tags.set(tag.name, tag);
  }

  /**
   * @param {string|string[]} patterns
   * @return {Iterator<Tag>} of all tags
   */
  async *tags(patterns) {
    await this.initializeTags();

    yield* matcher(this._tags.values(), patterns, {
      name: "name"
    });
  }

  /**
   * @param {string} name
   * @return {Tag}
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
   * Create a pull request (or deliver an already present for thefiven name)
   * @param {string} name of the pr
   * @param {Branch} source branch
   * @param {Object} options
   * @return {PullRequest}
   */
  async createPullRequest(name, source, options) {
    await this.initializePullRequests();
    return this.addPullRequest(name, source, options);
  }

  /**
   * Add a pull request
   * @param {string} name
   * @param {Branch} source
   * @param {Object} options
   * @return {PullRequest}
   */
  addPullRequest(name, source, options) {
    let pr = this._pullRequests.get(name);
    if (pr === undefined) {
      pr = new this.pullRequestClass(name, source, this, options);
      this._pullRequests.set(pr.name, pr);
    }
    return pr;
  }

  _addPullRequest(pr) {
    this._pullRequests.set(pr.name, pr);
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

  _addHook(hook) {
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
   * @return {Hook} all hooks of the repository
   */
  async *hooks() {
    await this.initializeHooks();
    for (const hook of this._hooks) {
      yield hook;
    }
  }

  /**
   * Get Hook
   * @param {string|number} id
   * @return {Hook} for the given id
   */
  async hook(id) {
    for await (const hook of this.hooks()) {
      if (hook.id == id) {
        // string of number
        return hook;
      }
    }
  }

  /**
   * Get type of the repository.
   * @return {string} 'git'
   */
  get type() {
    return "git";
  }

  /**
   * Get sha of a ref.
   * @param {string} ref
   * @return {string} sha of the ref
   */
  async refId(ref) {
    return undefined;
  }

  /**
   * By default we use the owners implementation.
   * @return {Class} as defined in the owner
   */
  get repositoryClass() {
    return this.owner.repositoryClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Class} as defined in the owner
   */
  get pullRequestClass() {
    return this.owner.pullRequestClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Class} as defined in the owner
   */
  get branchClass() {
    return this.owner.branchClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Class} as defined in the owner
   */
  get entryClass() {
    return this.owner.entryClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Class} as defined in the owner
   */
  get hookClass() {
    return this.owner.hookClass;
  }

  toString() {
    return this.fullName;
  }

  /**
   * Provide name and all defined attributes
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
