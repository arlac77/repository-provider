import { state_attribute_writable } from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 */
export class Milestone extends OwnedObject {
  static attributes = {
    ...super.attributes,
    state: state_attribute_writable
  };

  async *issues() {}
}
