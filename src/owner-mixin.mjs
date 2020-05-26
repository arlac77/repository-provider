import { LogLevelMixin } from "loglevel-mixin";
import { Repository } from "./repository.mjs";
import { Branch } from "./branch.mjs";
import { PullRequest } from "./pull-request.mjs";
import { match } from "./util.mjs";

/**
 * Collection of repositories
 * @property {Map<string,Repository>} repositories
 */
export function RepositoryOwnerMixin(parent) {
  return LogLevelMixin(
    class Owner extends parent {
      /**
       * options
       */
      static get defaultOptions() {
        return {
          /**
           * default logger
           */
          log: (...args) => console.log(...args),
          logLevel: "info"
        };
      }

      constructor(...args) {
        super(...args);
        Object.defineProperties(this, {
          _repositories: { value: new Map() }
        });
      }

      /**
       * @return {Class} repository class used by the Provider
       */
      get repositoryClass() {
        return Repository;
      }

      /**
       * @return {Class} branch class used by the Provider
       */
      get branchClass() {
        return Branch;
      }

      /**
       * @return {Class} entry class used by the Provider
       */
      get entryClass() {
        return undefined;
      }

      /**
       * @return {Class} pull request class used by the Provider
       */
      get pullRequestClass() {
        return PullRequest;
      }

      /**
       * Normalizes a repository name
       * strips branch away
       * @param {string} name
       * @param {boolean} forLookup
       * @return {string} normalized name
       */
      normalizeRepositoryName(name, forLookup) {
        name = name.replace(/#.*$/, "");

        const parts = name.split(/\//);
        if (parts.length >= 2) {
          if (parts[parts.length - 2] === this.name) {
            name = parts[parts.length - 1];
          }
        }

        if (forLookup && !this.areRepositoryNamesCaseSensitive) {
          return name.toLowerCase();
        }

        return name;
      }

      /**
       * Are repositroy names case sensitive.
       * Overwrite and return false if you want to have case insensitive repository lookup
       * @return {boolean} true
       */
      get areRepositoryNamesCaseSensitive() {
        return true;
      }

      /**
       * Are repositroy group names case sensitive.
       * Overwrite and return false if you want to have case insensitive group lookup
       * @return {boolean} true
       */
      get areGroupNamesCaseSensitive() {
        return true;
      }

      /**
       * Lookup a repository
       * @param {string} name of the repository may contain a #branch
       * @return {Promise<Repository>}
       */
      async repository(name) {
        if (name === undefined) {
          return undefined;
        }

        await this.initializeRepositories();

        return this._repositories.get(this.normalizeRepositoryName(name, true));
      }

      /**
       * List repositories for the owner
       * @param {string[]|string} matchingPatterns
       * @return {Iterator<Repository>} all matching repositories of the owner
       */
      async *repositories(patterns) {
        await this.initializeRepositories();
        for (const name of this.match(
          this._repositories.keys(),
          patterns,
          this.areRepositoryNamesCaseSensitive
        )) {
          yield this._repositories.get(name);
        }
      }

      /**
       * Match entries against pattern
       * @param {Iterator<string>} entries
       * @param {string[]} patterns
       * @param {boolean} caseSensitive
       * @return {Iterator<string>} filtered entries
       */
      *match(entries, patterns, caseSensitive) {
        yield* match(entries, patterns, undefined, caseSensitive);
      }

      /**
       * Create a new {@link Repository} in the provider.
       * If there is already if repository for the given name it will be returned
       * @param {string} name
       * @param {Object} options
       * @return {Promise<Repository>} newly created repository (if not already present)
       */
      async createRepository(name, options) {
        return this.addRepository(name, options);
      }

      /**
       * Add a {@link Repository} to the group.
       * Only adds the repository to the in memory representation (does not execute any provider actions)
       * @param {string} name
       * @param {Object} options
       * @return {Promise<Repository>} newly created repository
       */
      addRepository(name, options) {
        const normalizedName = this.normalizeRepositoryName(name, true);
        let repository = this._repositories.get(normalizedName);
        if (repository === undefined) {
          repository = new this.repositoryClass(this, name, options);
          this._repositories.set(normalizedName, repository);
        }
        return repository;
      }

      /**
       * Delete a repository
       * @param {string} name
       * @return {Promise<undefined>}
       */
      async deleteRepository(name) {
        this._repositories.delete(this.normalizeRepositoryName(name, true));
      }

      /**
       * Lookup a branch
       * First lookup repository then the branch
       * If no branch was specified then the default branch will be delivered.
       * @see {@link Repository#defaultBranch}
       * @param {string} name with optional branch name as '#myBranchName'
       * @return {Promise<Branch|undefined>}
       */
      async branch(name) {
        if (name === undefined) {
          return undefined;
        }

        const [repoName, branchName] = name.split(/#/);
        const repository = await this.repository(repoName);

        if (repository === undefined) {
          return undefined;
        }

        return branchName === undefined
          ? repository.defaultBranch
          : repository.branch(branchName);
      }

      /**
       * List branches for the owner
       * @param {string[]|string} matchingPatterns
       * @return {Iterator<Branch>} all matching branches of the owner
       */
      async *branches(patterns) {
        const [repoPatterns, branchPatterns] = patterns.split(/#/);

        await this.initializeRepositories();

        for (const name of this.match(
          this._repositories.keys(),
          repoPatterns,
          this.areRepositoriesCaseSensitive
        )) {
          const repository = this._repositories.get(name);
          const branch =
            branchPatterns === undefined
              ? repository.defaultBranch
              : repository.branch(branchPatterns);
          if (branch !== undefined) {
            yield branch;
          }
        }
      }

      async tag(name) {}

      async *tags(patterns) {}

      initialize() {}
      initializeRepositories() {
        return this.initialize();
      }
    }
  );
}
