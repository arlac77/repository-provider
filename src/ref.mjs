import { OwnedObject } from "./owned-object.mjs";

/**
 * @typedef {Object} ContentEntry
 * @property {string} name
 * 
 */

/**
 * Base for Branch and Tag
 */
export class Ref extends OwnedObject {
  /**
   * options
   */
  static get attributes() {
    return {
      ...super.attributes,

      /**
       * Can the branch be modified.
       * @return {string}
       */
      isProtected: { type: "boolean" }
    };
  }

  /**
   * Check for equality.
   * @param {Ref} other
   * @return {boolean} true if name and repository are equal
   */
  equals(other) {
    return super.equals(other) && this.repository.equals(other.repository);
  }

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
   * Get sha of a ref.
   * @param {string} ref
   * @return {Promise<string>} sha of the ref
   */
  async refId(ref = this.ref) {
    return this.repository.refId(ref);
  }

  /**
   * List entries of the branch.
   * @param {string[]} [matchingPatterns]
   * @return {AsyncIterator<ContentEntry>} all matching entries in the branch
   */
  async *entries(matchingPatterns) {}

  /**
   * List all entries of the branch.
   * @return {AsyncIterator<ContentEntry>} all entries in the branch
   */
  async *[Symbol.asyncIterator]() {
    return yield* this.entries();
  }

  /**
   * Get exactly one matching entry by name or undefine if no such entry is found.
   * @param {string} name
   * @return {Promise<ContentEntry>}
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
   * @return {string}
   */
  get repository() {
    return this.owner;
  }

  get slug() {
    return this.repository.slug;
  }

  /**
   * Repository and branch name combined.
   * @return {string} 'repo#branch'
   */
  get fullName() {
    return `${this.repository.fullName}#${this.name}`;
  }

  /**
   * Repository fullName and branch name combined.
   * But skipping the branch name if it is the default branch.
   * @return {string} 'user/repo#branch'
   */
  get fullCondensedName() {
    return this.isDefault
      ? this.repository.fullName
      : `${this.repository.fullName}#${this.name}`;
  }

  /**
   * Short human readable identifier with provider and branch.
   * @return {string}
   */
  get identifier() {
    return `${this.provider.name}:${this.fullCondensedName}`;
  }

  /**
   * Same as identifier.
   * @return {string}
   */
  toString() {
    return this.identifier;
  }

  /**
   * Url of issue tracking system.
   * @see {@link Repository#issuesURL}
   * @return {string} as provided from the repository
   */
  get issuesURL() {
    return this.repository.issuesURL;
  }

  /**
   * Url of home page.
   * @see {@link Repository#homePageURL}
   * @return {string} as provided from the repository
   */
  get homePageURL() {
    return this.repository.homePageURL;
  }

  /**
   * Forwarded from the repository
   */
  get isLocked() {
    return this.repository.isLocked;
  }

  /**
   * Forwarded from the repository
   */
  get isArchived() {
    return this.repository.isArchived;
  }

  /**
   * Forwarded from the repository
   */
  get isDisabled() {
    return this.repository.isDisabled;
  }

  /**
   *
   * @return false
   */
  get isProtected() {
    return false;
  }
}
