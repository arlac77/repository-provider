import { OwnedObject } from "./owned-object.mjs";

/**
 */
export class Milestone extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      state: { type: "string" }
    };
  }

  async *issues() {}
}
