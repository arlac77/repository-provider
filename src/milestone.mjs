import { NamedObject } from "./named-object.mjs";

/**
 */
export class Milestone extends NamedObject {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: undefined,
      state: undefined,
      title: undefined
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
