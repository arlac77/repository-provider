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
  static get registerInstanceMethodName() {
    return "_add" + this.name;
  }

  constructor(owner, name, options) {
    super(name, options, {
      owner: { value: owner }
    });

    owner[this.constructor.registerInstanceMethodName](this);
  }
}
