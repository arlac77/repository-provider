/**
 */
export class Milestone {
    static get defaultOptions() {
      return {
        id: undefined,
        state: undefined,
        title: undefined,
        description: undefined
      };
    }
  
    constructor(owner, options) {
      definePropertiesFromOptions(this, options);
      owner.addMilestone(this);
    }

    async *issues() {}
}  
