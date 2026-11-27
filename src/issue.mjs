import { addType } from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 *
 */
export class Issue extends OwnedObject {
  async *labels() {}
  async *assignees() {}
  async assignee() {}
  async milestone() {}

  static {
    addType(this);
  }
}
