import { matcher } from "matching-iterator";
import { OwnedObject } from "./owned-object.mjs";
import { Hook } from "./hook.mjs";
import { Tag } from "./tag.mjs";
import { Branch } from "./branch.mjs";
import { PullRequest } from "./pull-request.mjs";
import { RepositoryOwner } from "./repository-owner.mjs";
import { Commit } from "./commit.mjs";
import {
  url_attribute,
  boolean_attribute,
  boolean_read_only_attribute,
  default_attribute
} from "./attributes.mjs";

/**
 * @typedef {Object} ContentEntry
 * @property {string} name
 *

/**
 * Abstract repository
 * @class Repository
 * @param {RepositoryOwner} owner
 * @param {string} name (#branch) will be removed
 * @param {Object} [options]
 * @param {string} [options.description] human readable description
 * @param {string} [options.id] internal id
 *
 * @property {RepositoryOwner} owner
 * @property {string} name without (#branch)
 * @property {string} [description] from options.description
 * @property {string} [id] from options.id
 * @property {Map<string,Branch>} branches
 * @property {Map<string,Tag>} tags
 * @property {Map<string,PullRequest>} pullRequests
 * @property {Map<string,Milestone>} milestones
 */
export class Repository extends OwnedObject {
  static get addMethodName() {
    return "_addRepository";
  }

  static get deleteMethodName() {
    return "_deleteRepository";
  }

  static get collectionName() {
    return "repositories";
  }

  static defaultBranchName = "master";

  /**
   * options
   */
  static get attributes() {
    return {
      ...super.attributes,
      url: url_attribute,

      /**
       * The name of the default branch
       * @return {string}
       */
      defaultBranchName: { ...default_attribute, default: Repository.defaultBranchName },

      cloneURL: url_attribute,

      isArchived: boolean_attribute,
      isLocked: boolean_attribute,
      isDisabled: boolean_attribute,
      isTemplate: boolean_attribute,
      isFork: boolean_read_only_attribute
    };
  }

  #branches = new Map();
  #tags = new Map();
  #projects = new Map();
  #applications = new Map();
  #milestones = new Map();
  #pullRequests = new Map();
  #hooks = [];

  constructor(owner, name, options) {
    super(owner, owner.normalizeRepositoryName(name, false), options);
  }

  /**
   * Name of the repo as used in the URL.
   * @return {string}
   */
  get slug() {
    return `${this.owner.name}/${this.name}`;
  }

  get url() {
    return `${this.provider.url}${this.slug}`;
  }

  get defaultBranchName()
  {
    return Repository.defaultBranchName;
  }

  /**
   * Lookup entries form the head of the default branch.
   * {@link Branch#entry}
   * @return {Promise<ContentEntry>}
   */
  async entry(name) {
    return (await this.defaultBranch).entry(name);
  }

  /**
   * List entries of the default branch.
   * @param {string[]|string} [patterns]
   * @return {AsyncIterator<ContentEntry>} all matching entries in the branch
   */
  async *entries(patterns) {
    yield* (await this.defaultBranch).entries(patterns);
  }

  /**
   * Get exactly one matching entry by name or undefined if no such entry is found.
   * @param {string} name
   * @return {Promise<ContentEntry|undefined>}
   */
  async maybeEntry(name) {
    return (await this.defaultBranch).maybeEntry(name);
  }

  /**
   * List commits of the default branch.
   * @param {Object} [options]
   * @return {AsyncIterator<Commit>} all matching commits in the repository
   */
  async *commits(options) {}

  /**
   * The url used for cloning the repo.
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
   * By default we are not archived.
   * @return {boolean} false
   */
  get isArchived() {
    return false;
  }

  /**
   * By default we are not locked.
   * @return {boolean} false
   */
  get isLocked() {
    return false;
  }

  /**
   * By default we are not disabled.
   * @return {boolean} false
   */
  get isDisabled() {
    return false;
  }

  /**
   * By default we are not a template.
   * @return {boolean} false
   */
  get isTemplate() {
    return false;
  }

  /**
   * Delete the repository from the {@link Provider}.
   * {@link Provider#deleteRepository}
   * @return {Promise<any>}
   */
  async delete() {
    return this.owner.deleteRepository(this.name);
  }

  /**
   * Lookup the default branch.
   * @return {Promise<Branch|undefined>} branch named after defaultBranchName
   */
  get defaultBranch() {
    return this.branch(this.defaultBranchName);
  }

  /**
   * Lookup branch by name.
   * @param {string} name
   * @return {Promise<Branch|undefined>}
   */
  async branch(name) {
    if (name === this.defaultBranchName) {
      return this.#branches.get(name) || this.addBranch(name);
    }

    await this.initializeBranches();
    return this.#branches.get(name);
  }

  /**
   * @return {boolean} true if there is at least one branch
   */
  get hasBranches() {
    return this.#branches.size > 0;
  }

  /**
   * @param {string[]|string} [patterns]
   * @return {AsyncIterator<Branch>} of all branches
   */
  async *branches(patterns) {
    await this.initializeBranches();
    yield* matcher(this.#branches.values(), patterns, {
      name: "name"
    });
  }

  /**
   * Create a new {@link Branch} by cloning a given source branch.
   * @param {string} name of the new branch
   * @param {Branch} source branch defaults to the defaultBranch
   * @param {Object} [options]
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
   * @param {Object} [options] to be passed to the branch
   * @return {Branch} newly created branch
   */
  addBranch(name, options) {
    const branch = this.#branches.get(name);
    if (branch) {
      if (options) {
        branch.updateAttributes(options);
      }

      return branch;
    }

    return new this.branchClass(this, name, options);
  }

  _addBranch(branch) {
    this.#branches.set(branch.name, branch);
  }

  /**
   * Delete a {@link Branch}.
   * @param {string} name of the branch
   * @return {Promise<any>}
   */
  async deleteBranch(name) {
    this.#branches.delete(name);
  }

  /**
   * Get a Tag.
   * @param {string} name
   * @return {Promise<Tag>}
   */
  async tag(name) {
    await this.initializeTags();
    return this.#tags.get(name);
  }

  /**
   * @param {string[]|string} [patterns]
   * @return {AsyncIterator<Tag>} of all tags
   */
  async *tags(patterns) {
    await this.initializeTags();

    yield* matcher(this.#tags.values(), patterns, {
      name: "name"
    });
  }

  /**
   * Add a new {@link Tag}.
   * Internal tag creation does not call repository.initialize()
   * @param {string} name of the new tag
   * @param {Object} [options]
   * @return {Tag} newly created tag
   */
  addTag(name, options) {
    return this.#tags.get(name) || new this.tagClass(this, name, options);
  }

  _addTag(tag) {
    this.#tags.set(tag.name, tag);
  }

  /**
   * Create a pull request (or deliver an already present for the given name).
   * @param {string} name of the pr
   * @param {Branch} source branch
   * @param {Object} [options]
   * @return {Promise<PullRequest>}
   */
  async createPullRequest(name, source, options) {
    await this.initializePullRequests();
    return this.addPullRequest(name, source, options);
  }

  /**
   * Add a pull request.
   * @param {string} name
   * @param {Branch} source
   * @param {Object} [options]
   * @return {PullRequest}
   */
  addPullRequest(name, source, options) {
    let pr = this.#pullRequests.get(name);
    if (pr === undefined) {
      pr = new this.pullRequestClass(name, source, this, options);
      this.#pullRequests.set(pr.name, pr);
    }
    return pr;
  }

  _addPullRequest(pr) {
    this.#pullRequests.set(pr.name, pr);
  }

  /**
   * Deliver all {@link PullRequest}s.
   * @return {AsyncIterator<PullRequest>} of all pull requests
   */
  async *pullRequests() {
    await this.initializePullRequests();

    for (const pr of this.#pullRequests.values()) {
      yield pr;
    }
  }

  /**
   * The @see {@link PullRequest} for a given name.
   * @param {string} name
   * @return {Promise<PullRequest|undefined>}
   */
  async pullRequest(name) {
    await this.initializePullRequests();
    return this.#pullRequests.get(name);
  }

  /**
   * Delete a {@link PullRequest}.
   * @param {string} name
   * @return {Promise<any>}
   */
  async deletePullRequest(name) {
    this.#pullRequests.delete(name);
  }

  /**
   * Add a new {@link Hook}.
   * @param {string} name of the new hoook name
   * @param {Object} [options]
   * @return {Hook} newly created hook
   */
  addHook(name, options) {
    return (
      this.#hooks.find(hook => hook.name == name) ||
      new this.hookClass(this, name, options)
    );
  }

  _addHook(hook) {
    this.#hooks.push(hook);
  }

  /**
   * Add a new Hook.
   * @param {Hook} hook
   */
  async createHook(hook) {
    this._addHook(hook);
  }

  /**
   * List hooks.
   * @return {AsyncIterator<Hook>} all hooks of the repository
   */
  async *hooks() {
    await this.initializeHooks();
    for (const hook of this.#hooks) {
      yield hook;
    }
  }

  /**
   * Get a Hook.
   * @param {string|number} id
   * @return {Promise<Hook|undefined>} for the given id
   */
  async hook(id) {
    for await (const hook of this.hooks()) {
      if (hook.id == id) {
        // string of number
        return hook;
      }
    }
  }

  _addMilestone(milestone) {
    this.#milestones.set(milestone.name, milestone);
  }

  /**
   * Get a Milestone.
   * @param {string} name
   * @return {Promise<Milestone|undefined>} for the given name
   */
  async milestone(name) {
    return this.#milestones.get(name);
  }

  _addProject(project) {
    this.#projects.set(project.name, project);
  }

  /**
   * Get a Project.
   * @param {string} name
   * @return {Promise<Project|undefined>} for the given name
   */
  async project(name) {
    return this.#projects.get(name);
  }

  _addApplication(application) {
    this.#applications.set(application.name, application);
  }

  /**
   * Get an Application.
   * @param {string} name
   * @return {Promise<Application|undefined>} for the given name
   */
  async application(name) {
    return this.#applications.get(name);
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
   * @return {Promise<string|undefined>} sha of the ref
   */
  async refId(ref) {}

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
      this.#pullRequests.set(pr.name, pr);
    }
  }
}
