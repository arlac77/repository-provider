import { matcher } from "matching-iterator";
import { Branch } from "./branch.mjs";
import { Repository } from "./repository.mjs";
import { asArray, stripBaseName, stripBaseNames } from "./util.mjs";

/**
 * Mixin to define a class able to handle a collection of repositories.
 * @param {Class} base to be extendet
 */
export function RepositoryOwner(base) {
  return class RepositoryOwner extends base {

    #repositories = new Map();

    /**
     * Normalizes a repository name.
     * Strips branch away.
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
     * Lookup a repository.
     * @param {string} name of the repository may contain a #branch
     * @return {Promise<Repository>}
     */
    async repository(name) {
      if (name !== undefined) {
        await this.initializeRepositories();
        return this.#repositories.get(this.normalizeRepositoryName(name, true));
      }
    }

    /**
     * List repositories for the owner.
     * @param {string[]|string} patterns
     * @return {AsyncIterator<Repository>} all matching repositories of the owner
     */
    async *repositories(patterns) {
      patterns = asArray(patterns);
      for (let p of patterns) {
        p = stripBaseName(p, this.provider.repositoryBases);

        const m = p.match(/^(\w+:)/);
        if (m) {
          if (!this.supportsBase(m[1])) {
            return;
          }
        }
      }
      patterns = patterns.map(p => p.replace(/#.*$/, ""));

      await this.initializeRepositories();
      yield* matcher(
        this.#repositories.values(),
        stripBaseNames(patterns, this.provider.repositoryBases),
        {
          caseSensitive: this.areRepositoryNamesCaseSensitive,
          name: "name"
        }
      );
    }

    /**
     * Lookup entity of a given type and name.
     * @param {string} type 
     * @param {string} name 
     * @param {function} split 
     * @param {Object} defaultItem 
     * @returns {NamedObject} from a repository
     */
    async lookup(type, name, split, defaultItem) {
      if (name !== undefined) {
        await this.initializeRepositories();

        name = stripBaseName(name, this.provider.repositoryBases);

        const [repoName, typeName] = split ? split(name) : name.split("/");
        const repository = this.#repositories.get(repoName);

        if (repository) {
          if (typeName === undefined && defaultItem) {
            return defaultItem(repository);
          } else {
            return repository[type](typeName);
          }
        }
      }
    }

    /**
     * List entities for a given type and pattern.
     * @param {string} type 
     * @param {string|string[]} patterns 
     * @param {function} split 
     * @param {Object} defaultItem
     * @return {AsyncIterator<NamedObject>} matching type and pattern
     */
    async *list(type, patterns, split, defaultItem) {
      await this.initializeRepositories();

      patterns = stripBaseNames(patterns, this.provider.repositoryBases);

      for (const pattern of asArray(patterns)) {
        const [repoPattern, typePattern] = split
          ? split(pattern)
          : pattern.split("/");

        for (const name of matcher(this.#repositories.keys(), repoPattern, {
          caseSensitive: this.areRepositoriesCaseSensitive
        })) {
          const repository = this.#repositories.get(name);

          if (typePattern === undefined && defaultItem) {
            const item = await defaultItem(repository);
            if (item !== undefined) {
              yield item;
            }
          } else {
            yield* repository[type](typePattern);
          }
        }
      }
    }

    /**
     * Create a new {@link Repository} in the provider.
     * If there is already if repository for the given name it will be returned.
     * @param {string} name
     * @param {Object} options
     * @return {Promise<Repository>} newly created repository (if not already present)
     */
    async createRepository(name, options) {
      return this.addRepository(name, options);
    }

    /**
     * Add a {@link Repository} to the group.
     * Only adds the repository to the in memory representation (does not execute any provider actions).
     * @param {string} name
     * @param {Object} options
     * @return {Promise<Repository>} newly created repository
     */
    addRepository(name, options) {
      return this.#repositories.get(this.normalizeRepositoryName(name, true)) || new this.repositoryClass(this, name, options);
    }

    _addRepository(repository)
    {
      const normalizedName = this.normalizeRepositoryName(repository.name, true);
      this.#repositories.set(normalizedName, repository);
    }

    /**
     * Delete a repository.
     * @param {string} name
     * @return {Promise<any>}
     */
    async deleteRepository(name) {
      this.#repositories.delete(this.normalizeRepositoryName(name, true));
    }

    initializeRepositories() {}

    /**
     * Lookup a branch.
     * First lookup repository then the branch.
     * If no branch was specified then the default branch will be delivered.
     * @see {@link Repository#defaultBranch}
     * @param {string} name with optional branch name as '#myBranchName'
     * @return {Promise<Branch|undefined>}
     */
    async branch(name) {
      return this.lookup(
        "branch",
        name,
        name => name.split(/#/),
        repository => repository.defaultBranch
      );
    }

    /**
     * List branches for the owner.
     * @param {string[]|string} patterns
     * @return {AsyncIterator<Branch>} all matching branches of the owner
     */
    async *branches(patterns) {
      yield* this.list(
        "branches",
        patterns,
        pattern => pattern.split(/#/),
        repository => repository.defaultBranch
      );
    }

    async tag(name) {
      return this.lookup("tag", name, name => name.split(/#/));
    }

    async *tags(patterns) {
      yield* this.list("tags", patterns, pattern => pattern.split(/#/));
    }

    async pullRequest(name) {
      return this.lookup("pullRequest", name);
    }

    async *pullRequests(patterns) {
      yield* this.list("pullRequests", patterns);
    }

    async project(name) {
      return this.lookup("project", name);
    }

    async *projects(patterns) {
      yield* this.list("projects", patterns);
    }

    async application(name) {
      return this.lookup("application", name);
    }

    async *applications(patterns) {
      yield* this.list("applications", patterns);
    }

    async milestone(name) {
      return this.lookup("milestone", name);
    }

    async *milestones(patterns) {
      yield* this.list("milestones", patterns);
    }

    async hook(name) {
      return this.lookup("hook", name);
    }

    async *hooks(patterns) {
      yield* this.list("hooks", patterns);
    }
  };
}
