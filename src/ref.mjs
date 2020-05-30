import { definePropertiesFromOptions, optionJSON, mapAttributes } from "./util.mjs";

/**
 * Base for Branch and Tag
 */
export class Ref {
  /**
   * options
   */
  static get defaultOptions() {
    return {
      /**
       * The description of the repository content.
       * @return {string}
       */
      description: undefined,

      /**
       * Can the brach be modified.
       * @return {string}
       */
      isProtected: undefined
    };
  }

  /**
   * Map attributes between external and internal representation
   */
  static get attributeMapping()
  {
    return {};
  }

  constructor(repository, name, options) {
    definePropertiesFromOptions(this, mapAttributes(options, this.constructor.attributeMapping), {
      name: { value: name },
      repository: { value: repository }
    });
  }

  /**
   * Check for equality
   * @param {Branch} other
   * @return {boolean} true if name and repository are equal
   */
  equals(other) {
    if (other === undefined) {
      return false;
    }

    return this.name === other.name && this.repository.equals(other.repository);
  }

  get refType() {
    return "unknown";
  }

  /**
   * ref name
   * @return {string} git ref of the Ref
   */
  get ref() {
    return `refs/${this.refType}/${this.name}`;
  }

  /**
   * Get sha of a ref
   * @param {string} ref
   * @return {string} sha of the ref
   */
  async refId(ref = this.ref) {
    return this.repository.refId(ref);
  }

  /**
   * List entries of the branch
   * @param {string[]} matchingPatterns
   * @return {Entry} all matching entries in the branch
   */
  async *entries(matchingPatterns) {}

  /**
   * List all entries of the branch
   * @return {asyncIterator<Entry>} all entries in the branch
   */
  async *[Symbol.asyncIterator]() {
    return yield* this.entries();
  }

  /**
   * Get exactly one matching entry by name or undefine if no such entry is found
   * @param {string} name
   * @return {Promise<Entry>}
   */
  async maybeEntry(name) {
    return (await this.entries(name).next()).value;
  }

  /**
   * Get exactly one matching entry by name (throws if entry is not found)
   * @param {string} name
   * @return {Promise<Entry>}
   */
  async entry(name) {
    const e = (await this.entries(name).next()).value;
    if (e === undefined) {
      throw new Error(`No such entry '${name}'`);
    }
    return e;
  }

  /**
   * The provider we live in
   * @return {Provider}
   */
  get provider() {
    return this.repository.provider;
  }

  /**
   * Branch owner
   * By default we provide the repository owner
   * @see {@link Repository#owner}
   * @return {string}
   */
  get owner() {
    return this.repository.owner;
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
   * forwarded from the repository
   */
  get isLocked() {
    return this.repository.isLocked;
  }

  /**
   * forwarded from the repository
   */
  get isArchived() {
    return this.repository.isArchived;
  }

  /**
   * forwarded from the repository
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

  /**
   * Provide name and all defined defaultOptions
   */
  toJSON() {
    return optionJSON(this, {
      name: this.name
    });
  }
}
