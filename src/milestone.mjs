import { OwnedObject } from "./owned-object.mjs";
import { state } from "./attributes.mjs";

/**
 */
export class Milestone extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      state
    };
  }

  async *issues() {}
}
