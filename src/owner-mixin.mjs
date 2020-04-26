import { LogLevelMixin } from "loglevel-mixin";
import { Repository } from "./repository.mjs";
import { Branch } from "./branch.mjs";
import { PullRequest } from "./pull-request.mjs";

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

        if(forLookup && !this.areRepositoryNamesCaseSensitive) {
          return name.toLowerCase();
        }

        return name;
      }

      /**
       * Are repositroy names case sensitive.
       * Overwrite and return false if you want to have case insensitive repository lookup
       * @return {boolean} true
       */
      get areRepositoryNamesCaseSensitive()
      {
        return true;
      }

      /**
       * Are repositroy group names case sensitive.
       * Overwrite and return false if you want to have case insensitive group lookup
       * @return {boolean} true
       */
      get areGroupNamesCaseSensitive()
      {
        return true;
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
       * Lookup a repository
       * @param {string} name of the repository may contain a #branch
       * @return {Promise<Repository>}
       */
      async repository(name) {
        if (name === undefined) {
          return undefined;
        }

        await this.initializeRepositories();
  
        return this._repositories.get(this.normalizeRepositoryName(name,true));
      }

      /**
       * List repositories for the owner
       * @param {string[]|string} matchingPatterns
       * @return {Iterator<Repository>} all matching repositories of the owner
       */
      async *repositories(patterns) {
        await this.initializeRepositories();
        for (const name of this.match(this._repositories.keys(), patterns, this.areRepositoryNamesCaseSensitive)) {
          yield this._repositories.get(name);
        }
      }

      /**
       * match entries against pattern
       * @param {*<string>} entries
       * @param {string[]} patterns
       * @param {boolean} caseSensitive 
       * @return {string *}
       */
      *match(entries, patterns, caseSensitive=true) {
        if (patterns === undefined) {
          for (const entry of entries) {
            yield entry;
          }
          return;
        }

        const rs = (Array.isArray(patterns) ? patterns : [patterns]).map(
          pattern => new RegExp("^" + pattern.replace(/\*/g, ".*") + "$", caseSensitive ? undefined : "i")
        );

        for (const entry of entries) {
          for (const r of rs) {
            if (entry.match(r)) {
              yield entry;
              break;
            }
          }
        }
      }

      /**
       * Create a new repository
       * if there is already if repository for the given name it will be returned
       * @param {string} name
       * @param {Object} options
       * @return {Promise<Repository>}
       */
      async createRepository(name, options) {
        let repository = await this.repository(name);

        if (repository === undefined) {
          repository = await this._createRepository(name, options);
        }

        return repository;
      }

      /**
       * Create a new {@link Repository}
       * All owner implementations must provide a repository._createRepository() to handle the real repository creation.
       * This method MUST NOT be called by application code directly. It should be implemented by child classes, and called by the internal class methods only.
       * Internal repository creation does not call owner.initialize()
       * @param {string} name
       * @param {Object} options
       * @return {Promise<Repository>} newly created repository
       */
      async _createRepository(name, options) {
        const repository = new this.repositoryClass(this, name, options);
        this._repositories.set(this.normalizeRepositoryName(repository.name, true), repository);
        return repository;
      }

      /**
       * Add a repository to the group (does not execute any provider actions)
       * @param {string} name
       * @param {Object} options
       */
      addRepository(name, options) {
        let repository = this._repositories.get(name);
        if (repository === undefined) {
          repository = new this.repositoryClass(this, name, options);
          this._repositories.set(this.normalizeRepositoryName(repository.name, true), repository);
        }
        return repository;
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
