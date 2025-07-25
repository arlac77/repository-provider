import { state_attribute } from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 */
export class Milestone extends OwnedObject {
  static attributes = {
    ...super.attributes,
    state: state_attribute
  };

  async *issues() {}
}
