import { addType } from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 *
 */
export class Application extends OwnedObject {
  static {
    addType(this);
  }
}
