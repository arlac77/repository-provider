import { NamedObject } from "./named-object.mjs";

/**
 * 
 */
export class Issue extends NamedObject {

  constructor(owner, name, options) {
    super(name, options, {
      owner: { value: owner }
    });

    owner._addIssue(this);
  }

  async *labels() {}
  async *assignees() {}
  async assignee() {}
  async milestone() {}
}
