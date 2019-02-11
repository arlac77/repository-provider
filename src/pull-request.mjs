import { notImplementedError, definePropertiesFromOptions } from "./util";

/**
 * Abstract pull request
 * {@link Repository#addPullRequest}
 * @param {Branch} source
 * @param {Branch} destination
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
       * @return {string}
       */
      state: undefined,

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
    let merged, state;

    const properties = {
      name: { value: name },
      source: { value: source },
      destination: { value: destination },
      merged: {
        set(value) {
          merged = value;
        },
        get() {
          return merged;
        }
      },
      state: {
        set(value) {
          state = value;
        },
        get() {
          return state;
        }
      }
    };

    definePropertiesFromOptions(this, options, properties);

    destination.addPullRequest(this);
  }

  get repository() {
    return this.destination.repository;
  }

  /**
   * @return {Provider}
   */
  get provider() {
    return this.destination.provider;
  }

  /**
   * Delete the pull request from the {@link Repository}.
   * @see {@link Repository#deletePullRequest}
   * @return {Promise}
   */
  async delete() {
    return this.destination.deletePullRequest(this.name);
  }

  /**
   * Merge the pull request
   */
  async merge() {
    return notImplementedError();
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
      ["state", this.state],
      ["merged", this.merged],
      ["destination", this.destination]
    ]
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  toJSON() {
    return {
      source: this.source,
      destination: this.destination,
      name: this.name,
      title: this.title,
      merged: this.merged,
      state: this.state
    };
  }
}
