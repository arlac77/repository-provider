import { NamedObject } from "./named-object.mjs";

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

  constructor(owner, name, options, additionalProperties) {
    super(name, options, {
      ...additionalProperties,
      owner: { value: owner }
    });

    owner[this.constructor.addMethodName](this);
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
   * API as given by the owner.
   * @return {string} url
   */
  get api() {
    return this.owner.api;
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
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get repositoryClass() {
    return this.owner.repositoryClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get pullRequestClass() {
    return this.owner.pullRequestClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get branchClass() {
    return this.owner.branchClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get tagClass() {
    return this.owner.tagClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get entryClass() {
    return this.owner.entryClass;
  }

  /**
   * By default we use the owners implementation.
   * @return {Function} as defined in the owner
   */
  get hookClass() {
    return this.owner.hookClass;
  }
}
