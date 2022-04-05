import { Ref } from "./ref.mjs";
import { PullRequest } from "./pull-request.mjs";
import { Repository } from "./repository.mjs";
import { Commit } from "./commit.mjs";


/**
 * Abstract branch.
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
   * Deliver repository and branch url combined.
   * @return {string} 'repoUrl#branch'
   */
  get url() {
    return this.isDefault
      ? this.repository.url
      : `${this.repository.url}#${this.name}`;
  }

  /**
   * @return {string} heades
   */
  get refType() {
    return "heads";
  }

  /**
   * Are we the default branch.
   * @return {boolean} true if name matches the repository default branch
   */
  get isDefault() {
    return this.name === this.repository.defaultBranchName;
  }

  /**
   * Delete the branch from the {@link Repository}.
   * @see {@link Repository#deleteBranch}
   * @return {Promise<any>}
   */
  async delete() {
    return this.repository.deleteBranch(this.name);
  }

  /**
   * Commit entries.
   * @param {string} message commit message
   * @param {ContentEntry[]} updates content to be commited
   * @param {Object} options
   * @return {Promise<CommitResult>}
   */
  async commit(message, updates, options) {}

  /**
   * Add commits into a pull request.
   *
   * @param {Commit|AsyncIterator<Commit>} commits to be commited
   * @param {Object} options
   * @param {Branch|string} options.pullRequestBranch to commit into
   * @param {boolean} options.dry do not create a branch and do not commit only create dummy PR
   * @param {boolean} options.skipWithoutCommits do not create a PR if no commits are given
   * @param {boolean} options.bodyFromCommitMessages generate body from commit messages
   * @param {string} [options.body] body of the PR
   * @return {Promise<PullRequest>}
   */
  async commitIntoPullRequest(commits, options) {
    const isBranch = options.pullRequestBranch instanceof Branch;

    if (options.dry) {
      return new PullRequest(
        isBranch ? options.pullRequestBranch : undefined,
        this,
        "DRY",
        options
      );
    }

    let prBranch;
    try {
      let body = "";

      if (commits) {
        function c2m(commit) {
          body += `${commit.entries.map(e => e.name).join(",")}
---
- ${commit.message}

`;
        }

        const exec = async commit => {
          if (prBranch === undefined) {
            prBranch = isBranch
              ? options.pullRequestBranch
              : await this.createBranch(options.pullRequestBranch);
          }
          await prBranch.commit(commit.message, commit.entries);
          c2m(commit);
        };

        if (commits.next) {
          for await (const commit of commits) {
            await exec(commit);
          }
        } else {
          await exec(commits);
        }
      }

      if (options.bodyFromCommitMessages) {
        options.body = body;
      }

      if (body.length > 0 && !options.skipWithoutCommits) {
        return prBranch.createPullRequest(this, options);
      } else {
        return new PullRequest(
          isBranch ? options.pullRequestBranch : undefined,
          this,
          "EMPTY",
          { ...options, empty: true }
        );
      }
    } catch (e) {
      if (!isBranch && prBranch) {
        await prBranch.delete();
      }
      throw e;
    }
  }

  /**
   * Remove entries form the branch.
   * @param {AsyncIterator<ContentEntry>} entries
   */
  async removeEntries(entries) {}

  /**
   * Create a pull request.
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
