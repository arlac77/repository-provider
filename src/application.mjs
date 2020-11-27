import { NamedObject } from "./named-object.mjs";

/**
 * 
 */
export class Application extends NamedObject {

  constructor(owner, name, options) {
    super(name, options, {
      owner: { value: owner }
    });

    owner._addApplication(this);
  }
}
