import { addType } from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 *
 */
export class Project extends OwnedObject {
  static {
    addType(this);
  }
}
