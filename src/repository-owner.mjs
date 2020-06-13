import { matcher } from "matching-iterator";

export default function RepoositoryOwner(base) {
  return class RepoositoryOwner extends base {

    constructor(...args) {
        super(...args);

        Object.defineProperties(this,{ _repositories: { value: new Map() } });
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
      yield* matcher(this._repositories.values(), patterns, {
        caseSensitive: this.areRepositoryNamesCaseSensitive,
        name: "name"
      });
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

    initializeRepositories() {
    }
  };
}
