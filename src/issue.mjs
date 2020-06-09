import { NamedObject } from "./named-object.mjs";

/**
 * 
 */
export class Issue extends NamedObject {
  async *labels() {}
  async *assignees() {}
  async assignee() {}
  async milestone() {}
}
