import {
  getAttributesJSON,
  attributeIterator,
  url_attribute,
  state_attribute_writable,
  body_attribute_writable,
  title_attribute_writable,
  boolean_attribute_false,
  boolean_attribute_writable_false,
  empty_attribute,
  types
} from "pacc";
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
 * @param {Object} [options]
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

  static get deleteMethodName() {
    return "_deletePullRequest";
  }

  static get type() {
    return "pull-request";
  }

  static get collectionName() {
    return "pullRequests";
  }

  /**
   * States to list pull request by default
   * @return {Set<string>} states to list by default
   */
  static defaultListStates = new Set(["OPEN"]);

  /**
   * possible states
   * @enum {string}
   */
  static states = new Set(["OPEN", "MERGED", "CLOSED"]);

  /**
   * All valid merge methods
   * @return {Set<string>} valid merge methods.
   * @enum {string}
   */
  static validMergeMethods = new Set(/*["MERGE", "SQUASH", "REBASE"]*/);

  /**
   * List all pull request for a given repo.
   * Result will be filtered by source branch, destination branch and states
   * @param {Repository} repository
   * @param {Object} [filter]
   * @param {Branch?} [filter.source]
   * @param {Branch?} [filter.destination]
   * @param {Set<string>} [filter.states]
   * @return {AsyncIterable<PullRequest>}
   */
  static async *list(repository, filter) {}

  /**
   * Open a pull request
   *
   * @param {Branch} source
   * @param {Branch} destination
   * @param {Object} [options]
   */
  static async open(source, destination, options) {
    return new this(source, destination, "-1", options);
  }

  static attributes = {
    ...super.attributes,
    body: body_attribute_writable,
    title: title_attribute_writable,
    url: url_attribute,

    /**
     * state of the pull request.
     * - OPEN
     * - MERGED
     * - CLOSED
     * @return {string}
     */
    state: {
      ...state_attribute_writable,
      default: "OPEN",
      values: this.states
    },

    /**
     * Locked state of the pull request.
     * @return {boolean}
     */
    locked: boolean_attribute_writable_false,

    /**
     * Merged state of the pull request.
     * @return {boolean}
     */
    merged: boolean_attribute_false,

    /**
     * Draft state of the pull request.
     * @return {boolean}
     */
    draft: boolean_attribute_writable_false,
    dry: boolean_attribute_false,
    empty: empty_attribute
  };

  /** @type {Branch} */ source;

  _state = "OPEN";

  constructor(source, owner, name, options) {
    super(owner, name, options);
    this.source = source;
  }

  set state(value) {
    value = value.toUpperCase();
    if (this.constructor.attributes.state.values.has(value)) {
      this._state = value;
    } else throw new Error(`Invalid Pull Request state ${value}`);
  }

  get state() {
    return this._state;
  }

  set merged(value) {
    if (value) {
      this.state = "MERGED";
    }
  }

  get merged() {
    return this.state === "MERGED";
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
    return `${this.repository.url}/pull/${this.name}`;
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
    return this.owner.repository;
  }

  /**
   * Delete the pull request from the {@link Repository}.
   * @see {@link Repository#deletePullRequest}
   * @return {Promise}
   */
  async delete() {
    return this.owner.deletePullRequest(this.name);
  }

  /**
   * Merge the pull request.
   * @param {string} method
   */
  async merge(method = "MERGE") {
    method = method.toUpperCase();
    // @ts-ignore
    if (this.constructor.validMergeMethods.has(method)) {
      // @ts-ignore
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
   * @return {AsyncIterable<Review>}
   */
  async *reviews() {}

  toString() {
    return [
      [this.name, this.title],
      ["source", this.source?.identifier],
      ["destination", this.owner.identifier],
      ...[
        ...attributeIterator(
          this.constructor.attributes,
          (name, attribute) =>
            !attribute.isKey &&
            attribute.type !== types.url &&
            name !== "title" &&
            name !== "body" &&
            this[name] !== undefined
        )
      ].map(([path, attribute]) => {
        const name = path.join(".");
        return [name, this[name]];
      })
    ]
      .map(([name, value]) => `${name}:${value}`)
      .join(",");
  }

  toJSON(filter) {
    return {
      ...getAttributesJSON(this, this.constructor.attributes, filter),
      source: this.source,
      destination: this.owner
    };
  }

  /**
   * Short human readable identifier with provider and branch.
   * @return {string}
   */
  get identifier() {
    return `${this.owner.identifier}[${this.name}]`;
  }
}
