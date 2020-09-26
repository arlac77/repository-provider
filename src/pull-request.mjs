import { optionJSON } from "./attribute.mjs";
import { NamedObject } from "./named-object.mjs";

/**
 * Abstract pull request
 * {@link Repository#addPullRequest}
 * @param {Branch} source merge source
 * @param {Branch} destination merge target
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
 */
export class PullRequest extends NamedObject {
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
   * List all pull request for a given repo
   * result will be filtered by source branch, destination branch and states
   * @param {Repository} repository
   * @param {Object} filter
   * @param {Branch?} filter.source
   * @param {Branch?} filter.destination
   * @param {Set<string>?} filter.states
   * @return {Iterator<PullRequest>}
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
       * the one line description of the pull request.
       * @return {string}
       */
      title: { type: "string" },

      /**
       * the description of the pull request.
       * @return {string}
       */
      body: { type: "string" },

      /**
       * state of the pull request.
       * - OPEN
       * - MERGED
       * - CLOSED
       * @return {string}
       */
      state: {
        default: "OPEN",
        type: "string"
      },

      /**
       * locked state of the pull request.
       * @return {boolean}
       */
      locked: {
        type: "boolean",
        default: false
      },

      /**
       * merged state of the pull request.
       * @return {boolean}
       */
      merged: {
        type: "boolean",
        default: false
      },

      draft: {
        type: "boolean",
        default: false
      }
    };
  }

  constructor(source, destination, name, options) {
    let state;

    super(name, options, {
      source: { value: source },
      destination: { value: destination },
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
      }
    });

    if (destination !== undefined) {
      destination._addPullRequest(this);
    }
  }

  set merged(flag) {
    if (flag) {
      this.state = "MERGED";
    }
  }

  get merged() {
    return this.state === "MERGED";
  }

  get number() {
    return this.name;
  }

  /**
   * @return {Repository} destination repository
   */
  get repository() {
    return this.destination === undefined
      ? undefined
      : this.destination.repository;
  }

  /**
   * @return {Provider}
   */
  get provider() {
    return this.destination === undefined
      ? undefined
      : this.destination.provider;
  }

  /**
   * Check for equality
   * @param {PullRequest} other
   * @return {boolean} true if number and repository are equal
   */
  equals(other) {
    return super.equals(other) && this.repository.equals(other.repository);
  }

  async write() {
    this._write();
  }

  async _write() {}

  /**
   * Delete the pull request from the {@link Repository}.
   * @see {@link Repository#deletePullRequest}
   * @return {Promise}
   */
  async delete() {
    return this.destination === undefined
      ? undefined
      : this.destination.deletePullRequest(this.number);
  }

  /**
   * Merge the pull request
   * @param {string} method
   */
  async merge(method) {
    method = method.toUpperCase();
    if (this.constructor.validMergeMethods.has(method)) {
      await this._merge(method);
      this.merged = true;
    } else {
      throw new Error(`Merging with ${method} is not supported`);
    }
  }

  /**
   * Decline the pull request
   */
  async decline() {}

  toString() {
    return [
      [this.name, this.title],
      ["source", this.source],
      ["destination", this.destination],
      ...Object.keys(this.constructor.attributes)
        .filter(
          k =>
            k !== "id" && k !== "title" && k !== "body" && this[k] !== undefined
        )
        .map(k => [k, this[k]])
    ]
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  toJSON() {
    return optionJSON(this, {
      source: this.source,
      destination: this.destination,
      name: this.name
    });
  }

  /**
   * Short human readable identifier with provider and branch
   * @return {string}
   */
  get identifier() {
    return `${this.destination.provider.name}/${this.destination.fullCondensedName}[${this.name}]`;
  }
}
