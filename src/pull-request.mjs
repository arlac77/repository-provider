import { optionJSON } from "./attribute.mjs";
import { OwnedObject } from "./owned-object.mjs";
import { Branch } from "./branch.mjs";
import { Repository } from "./repository.mjs";
import { Review } from "./review.mjs";

/**
 * Abstract pull request.
 * {@link Repository#addPullRequest}
 * @param {Branch} source merge source
 * @param {Branch} owner merge target
 * @param {string} name
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.state]
 * @param {boolean} [options.merged]
 * @param {boolean} [options.locked]

 * @property {string} name
 * @property {Branch} source
 * @property {Branch} destination
 * @property {string} [title]
 * @property {string} [state]
 * @property {boolean} [merged]
 * @property {boolean} [locked]
 * @property {string} url
 */
export class PullRequest extends OwnedObject {
  static get addMethodName() {
    return "_addPullRequest";
  }

  static get type() {
    return "pull-request";
  }

  static get collectionName() {
    return "pullRequests";
  }

  /**
   * All valid states
   * @return {Set<string>} valid states
   */
  static get validStates() {
    return new Set(["OPEN", "MERGED", "CLOSED"]);
  }

  /**
   * States to list pull request by default
   * @return {Set<string>} states to list by default
   */
  static get defaultListStates() {
    return new Set(["OPEN"]);
  }

  /**
   * All valid merge methods
   * @return {Set<string>} valid merge methods
   */
  static get validMergeMethods() {
    return new Set(/*["MERGE", "SQUASH", "REBASE"]*/);
  }

  /**
   * List all pull request for a given repo.
   * Result will be filtered by source branch, destination branch and states
   * @param {Repository} repository
   * @param {Object} filter
   * @param {Branch?} filter.source
   * @param {Branch?} filter.destination
   * @param {Set<string>?} filter.states
   * @return {AsyncIterator<PullRequest>}
   */
  static async *list(repository, filter) {}

  /**
   * Open a pull request
   *
   * @param {Branch} source
   * @param {Branch} destination
   * @param {Object} options
   */
  static async open(source, destination, options) {
    return new this(source, destination, "-1", options);
  }

  static get attributes() {
    return {
      ...super.attributes,
      /**
       * The one line description of the pull request.
       * @return {string}
       */
      title: { type: "string", writable: true },

      /**
       * The description of the pull request.
       * @return {string}
       */
      body: { type: "string", writable: true },

      /**
       * state of the pull request.
       * - OPEN
       * - MERGED
       * - CLOSED
       * @return {string}
       */
      state: {
        default: "OPEN",
        type: "string",
        writable: true
      },

      /**
       * Locked state of the pull request.
       * @return {boolean}
       */
      locked: {
        type: "boolean",
        default: false,
        writable: true
      },

      /**
       * Merged state of the pull request.
       * @return {boolean}
       */
      merged: {
        type: "boolean",
        default: false,
        writable: true
      },

      /**
       * Draft state of the pull request.
       * @return {boolean}
       */
      draft: {
        type: "boolean",
        default: false
      },

      dry: {
        type: "boolean",
        default: false
      },

      empty: {
        type: "boolean"
      },

      url: {
        type: "url"
      }
    };
  }

  constructor(source, owner, name, options) {
    let state = "OPEN";

    super(owner, name, options, {
      source: { value: source },
      state: {
        set(value) {
          value = value.toUpperCase();
          if (this.constructor.validStates.has(value)) {
            state = value;
          } else throw new Error(`Invalid Pull Request state ${value}`);
        },
        get() {
          return state;
        }
      },
      merged: {
        set(value) {
          if (value) {
            state = "MERGED";
          }
        },
        get() {
          return state === "MERGED";
        }
      }
    });
  }

  get destination() {
    return this.owner;
  }

  /**
   * Name of the PR together with the repository.
   * @return {string} PR full name
   */
  get fullName() {
    return `${this.repository.fullName}/${this.name}`;
  }

  /**
   * URL of the pull request.
   * @return {string} url
   */
  get url() {
    // TODO repo url
    return `${this.provider.url}${this.repository.fullName}/pull/${this.name}`;
  }

  get number() {
    return this.name;
  }

  get dry() {
    return false;
  }

  /**
   * @return {Repository} destination repository
   */
  get repository() {
    return this.owner?.repository;
  }

  /**
   * Check for equality
   * @param {PullRequest} other
   * @return {boolean} true if number and repository are equal
   */
  equals(other) {
    return super.equals(other) && this.repository.equals(other.repository);
  }

  /**
   * Delete the pull request from the {@link Repository}.
   * @see {@link Repository#deletePullRequest}
   * @return {Promise}
   */
  async delete() {
    return this.owner?.deletePullRequest(this.name);
  }

  /**
   * Merge the pull request.
   * @param {string} method
   */
  async merge(method = "MERGE") {
    method = method.toUpperCase();
    if (this.constructor.validMergeMethods.has(method)) {
      await this._merge(method);
      this.merged = true;
    } else {
      throw new Error(`Merging with ${method} is not supported`);
    }
  }

  /**
   * Decline the pull request.
   */
  async decline() {}

  /**
   * @return {AsyncIterator<Review>}
   */
  async *reviews() {}

  toString() {
    return [
      [this.name, this.title],
      ["source", this.source?.identifier],
      ["destination", this.owner.identifier],
      ...Object.entries(this.constructor.attributes)
        .filter(
          ([k, v]) =>
            !v.isKey &&
            v.type !== "url" &&
            k !== "title" &&
            k !== "body" &&
            this[k] !== undefined
        )
        .map(([k]) => [k, this[k]])
    ]
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  toJSON() {
    return optionJSON(this, {
      source: this.source,
      destination: this.owner
    });
  }

  /**
   * Short human readable identifier with provider and branch.
   * @return {string}
   */
  get identifier() {
    return `${this.owner.identifier}[${this.name}]`;
  }
}
