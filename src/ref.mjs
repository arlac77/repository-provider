import { name_attribute, boolean_attribute } from "pacc";
import { ContentEntry } from "content-entry";
import { OwnedObject } from "./owned-object.mjs";

/**
 * @typedef {import('./repository.mjs').Repository} Repository
 */

/**
 * Base for Branch and Tag
 */
// @ts-ignore
export class Ref extends OwnedObject {
  /**
   * Attributes
   * @type {Object}
   */
  static attributes = {
    name: name_attribute,

    /**
     * Can the ref be modified.
     * @return {boolean}
     */
    isProtected: boolean_attribute
  };

  static attributeMapping = {
    protected: "isProtected"
  };

  get refType() {
    return "unknown";
  }

  /**
   * Full ref path.
   * @return {string} git ref of the Ref
   */
  get ref() {
    return `refs/${this.refType}/${this.name}`;
  }

  /**
   * Get sha of our ref.
   * @return {Promise<string>} sha of the ref
   */
  get refId() {
    return this.owner.refId(this.ref);
  }

  /**
   * List entries of the branch.
   * @param {string[]|string} [matchingPatterns]
   * @return {AsyncGenerator<ContentEntry>} all matching entries in the branch
   */
  async *entries(matchingPatterns) {}

  /**
   * List all entries of the branch.
   * @return {AsyncGenerator<ContentEntry>} all entries in the branch
   */
  async *[Symbol.asyncIterator]() {
    return yield* this.entries();
  }

  /**
   * Get exactly one matching entry by name or undefine if no such entry is found.
   * @param {string} name
   * @return {Promise<ContentEntry|undefined>}
   */
  async maybeEntry(name) {
    return (await this.entries(name).next()).value;
  }

  /**
   * Get exactly one matching entry by name (throws if entry is not found).
   * @param {string} name
   * @return {Promise<ContentEntry>}
   */
  async entry(name) {
    const e = (await this.entries(name).next()).value;
    if (e === undefined) {
      throw new Error(`No such entry '${name}'`);
    }
    return e;
  }

  /**
   * Ref owner.
   * By default we provide the repository owner
   * @see {@link Repository#owner}
   * @return {Repository}
   */
  get repository() {
    return this.owner;
  }

  /**
   * Repository and branch name combined.
   * @return {string} 'repo#branch'
   */
  get fullName() {
    return `${this.owner.fullName}#${this.name}`;
  }

  /**
   * Repository fullName and branch name combined.
   * But skipping the branch name if it is the default branch.
   * @return {string} 'user/repo#branch'
   */
  get fullCondensedName() {
    return this.isDefault
      ? this.owner.fullName
      : `${this.owner.fullName}#${this.name}`;
  }

  get identifier() {
    return this.isDefault
      ? this.owner.identifier
      : `${this.owner.identifier}#${this.name}`;
  }

  /**
   *
   * @return false
   */
  get isProtected() {
    return false;
  }

  /**
   * Are we the default ref.
   * @return {boolean} false
   */
  get isDefault() {
    return false;
  }
}
