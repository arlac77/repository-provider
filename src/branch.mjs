import { Ref } from "./ref.mjs";

/**
 * @typedef {Object} CommitResult
 * @property {string} ref
 */

/**
 * Abstract branch
 * @see {@link Repository#_addBranch}
 * @param {Repository} repository
 * @param {string} name
 * @param {Object} options
 *
 * @property {Repository} repository
 * @property {Provider} provider
 * @property {string} name
 */
export class Branch extends Ref {
  constructor(repository, name = repository.defaultBranchName, options) {
    super(repository, name, options);
    repository._addBranch(this);
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

  get refType() {
    return "heads";
  }

  /**
   * Are we the default branch
   * @return {boolean} true if name is the repository default branch
   */
  get isDefault() {
    return this.name === this.repository.defaultBranchName;
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
   * Commit entries
   * @param {string} message commit message
   * @param {ConentEntry[]} updates content to be commited
   * @param {Object} options
   * @return {CommitResult}
   */
  async commit(message, updates, options) {}

  /**
   * Commit entries into a pull request.
   *
   * @param {string} message commit message
   * @param {ConentEntry[]} updates content to be commited
   * @param {Object} options
   * @param {Branch|string} options.pullRequestBranch
   * @return {PullRequest}
   */
  async commitIntoPullRequest(message, updates, options) {
    const prBranch =
      options.pullRequestBranch instanceof Branch
        ? options.pullRequestBranch
        : await this.createBranch(options.pullRequestBranch);

    try {
      await prBranch.commit(message, updates);
      return await prBranch.createPullRequest(this, options);
    } catch (e) {
      if (!options.pullRequestBranch instanceof Branch) {
        await prBranch.delete();
      }
      throw e;
    }
  }

  /**
   * Remove entries form the branch
   * @param {Iterator <ConentEntry>} entries
   */
  async removeEntries(entries) {}

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
   * @param {Object} options
   * @return {Promise<PullRequest>}
   */
  async createPullRequest(toBranch, options) {
    return this.pullRequestClass.open(this, toBranch, options);
  }

  async _addPullRequest(pullRequest) {
    return this.repository._addPullRequest(pullRequest);
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
   * Create a new {@link Branch} by cloning a given source branch.
   * Simply calls Repository.createBranch() with the receiver as source branch
   * @param {string} name the new branch
   * @param {Object} options
   * @return {Promise<Branch>} newly created branch (or already present old one with the same name)
   */
  async createBranch(name, options) {
    return this.repository.createBranch(name, this, options);
  }
}
