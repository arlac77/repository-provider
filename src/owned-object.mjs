import { NamedObject } from "./named-object.mjs";

/**
 * @typedef {import('./base-provider.mjs').BaseProvider} BaseProvider
 * @typedef {import('./repository.mjs').Repository} Repository
 */

/**
 * Named Object registering itself in the owner.
 */
export class OwnedObject extends NamedObject {
  /**
   * Method name to be called to register one instance in the owner.
   * sample: Application => _addApplication
   * @return {string}
   */
  static get addMethodName() {
    return "_add" + this.name;
  }

  /**
   * Method name to be called to unregister one instance in the owner.
   * sample: Application => _deleteApplication
   * @return {string}
   */
  static get deleteMethodName() {
    return "_delete" + this.name;
  }

  owner;

  constructor(owner, name, options, additionalProperties) {
    super(name, options, additionalProperties);
    this.owner = owner;
    // @ts-ignore
    owner[this.constructor.addMethodName](this);
  }

  /**
   * Removes the receiver from the owner.
   */
  delete() {
    // @ts-ignore
    this.owner[this.constructor.deleteMethodName](this);
  }

  /**
   * Check for equality.
   * @param {OwnedObject} other
   * @return {boolean} true if receiver and owner are equal
   */
  equals(other) {
    return super.equals(other) && this.owner.equals(other.owner);
  }

  /**
   * Url of home page.
   * @see {@link Repository#homePageURL}
   * @return {string} as provided from the owner
   */
  get homePageURL() {
    return this.owner.homePageURL;
  }

  /**
   * Url of issue tracking system.
   * @see {@link Repository#issuesURL}
   * @return {string|undefined} as provided from the repository
   */
  get issuesURL() {
    return this.owner.issuesURL;
  }

  /**
   * Forwarded from the owner.
   * @return {boolean}
   */
  get isLocked() {
    return this.owner.isLocked;
  }

  /**
   * Forwarded from the owner.
   * @return {boolean}
   */
  get isArchived() {
    return this.owner.isArchived;
  }

  /**
   * Forwarded from the owner.
   * @return {boolean}
   */
  get isDisabled() {
    return this.owner.isDisabled;
  }

  /**
   * API as given by the owner.
   * @return {string} url
   */
  get api() {
    return this.owner.api;
  }

  /**
   * API as given by the owner.
   * @return {string} url
   */
  get slug() {
    return this.owner.slug;
  }

  /**
   * URL as given by the owner.
   * @return {string} url
   */
  get url() {
    return this.owner.url;
  }

  /**
   * The provider we live in.
   * @return {BaseProvider}
   */
  get provider() {
    return this.owner.provider;
  }

  /**
   * Short human readable identifier with provider and branch.
   * @return {string}
   */
  get identifier() {
    return `${this.provider.name}:${this.fullCondensedName}`;
  }

  /**
   * @return {string} name with owner name
   */
  get fullName() {
    return this.owner === this.provider || this.owner.name === undefined
      ? this.name
      : this.owner.name + "/" + this.name;
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  trace(...args) {
    return this.owner.trace(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  info(...args) {
    return this.owner.info(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  warn(...args) {
    return this.owner.warn(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  error(...args) {
    return this.owner.error(...args);
  }

  /**
   * Forwarded to the owner.
   * @param  {...any} args
   */
  debug(...args) {
    return this.owner.debug(...args);
  }

  get repositoryClass() {
    return this.owner.repositoryClass;
  }

  get pullRequestClass() {
    return this.owner.pullRequestClass;
  }

  get branchClass() {
    return this.owner.branchClass;
  }

  get tagClass() {
    return this.owner.tagClass;
  }

  get entryClass() {
    return this.owner.entryClass;
  }

  get hookClass() {
    return this.owner.hookClass;
  }
}
