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
}
