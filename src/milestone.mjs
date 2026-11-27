import { addType, state_attribute_writable } from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 */
export class Milestone extends OwnedObject {
  static attributes = {
    state: state_attribute_writable
  };

  static {
    addType(this);
  }

  async *issues() {}
}
