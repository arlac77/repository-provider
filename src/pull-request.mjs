import {
  notImplementedError,
  definePropertiesFromOptions,
  optionJSON
} from "./util.mjs";

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
export class PullRequest {
  /**
   * All valid states
   * @return {Set<string>} valid states
   */
  static get validStates() {
    return new Set(["OPEN", "MERGED", "CLOSED"]);
  }

  /**
   * All valid merge methods
   * @return {Set<string>} valid merge methods
   */
  static get validMergeMethods() {
    return new Set(/*["MERGE", "SQUASH", "REBASE"]*/);
  }

  /**
   * list all pull request for a given destination repo
   * @param {Repository} destination
   * @param {Set<string>} states
   * @return {Iterator<PullRequest>}
   */
  static async *list(destination, states) {}

  /**
   * Opens a new pull request
   * @param {Branch} source
   * @param {Branch} destination
   * @param {Object} options
   * @param {string} options.title
   * @param {string} options.body
   * @return {PullRequest}
   */
  static async open(source, destination, options) {
    return new this(source, destination, "0", options);
  }

  static get defaultOptions() {
    return {
      /**
       * internal id.
       * @return {string}
       */
      id: undefined,

      /**
       * the one line description of the pull request.
       * @return {string}
       */
      title: undefined,

      /**
       * the description of the pull request.
       * @return {string}
       */
      body: undefined,

      /**
       * state of the pull request.
       * - OPEN
       * - MERGED
       * - CLOSED
       * @return {string}
       */
      state: "OPEN",

      /**
       * locked state of the pull request.
       * @return {boolean}
       */
      locked: false,

      /**
       * merged state of the pull request.
       * @return {boolean}
       */
      merged: false
    };
  }

  constructor(source, destination, name, options) {
    let state;

    const properties = {
      name: { value: name },
      source: { value: source },
      destination: { value: destination },
      merged: {
        set(value) {
          if (value) {
            state = "MERGED";
          }
        },
        get() {
          return state === "MERGED";
        }
      },
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
    };

    definePropertiesFromOptions(this, options, properties);

    if (destination !== undefined) {
      destination.addPullRequest(this);
    }
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
      : this.destination.deletePullRequest(this.name);
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
  async decline() {
    return notImplementedError();
  }

  toString() {
    return [
      [this.name, this.title],
      ...Object.keys(this.constructor.defaultOptions)
        .filter(k => k !== "id" && k !== "title" && k !== "body")
        .map(k => [k, this[k]]),
      ["destination", this.destination]
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
}
