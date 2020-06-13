import { NamedObject } from "./named-object.mjs";

/**
 */
export class Milestone extends NamedObject {
  static get attributes() {
    return {
      ...super.attributes,
      state: undefined
    };
  }

  constructor(owner, name, options) {
    super(name, options, {
      owner: { value: owner }
    });

    owner._addMilestone(this);
  }

  async *issues() {}
}
