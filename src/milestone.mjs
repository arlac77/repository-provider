import { OwnedObject } from "./owned-object.mjs";
import { state_attribute } from "./attributes.mjs";

/**
 */
export class Milestone extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      state: state_attribute
    };
  }

  async *issues() {}
}
