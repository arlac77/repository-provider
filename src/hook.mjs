import { optionJSON } from "./attribute.mjs";
import { OwnedObject } from "./owned-object.mjs";

/**
 * Repository hook.
 */
export class Hook extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      id: { type: "string", writable: true },
      url: { type: "url", description: "target url", writable: true },
      secret: { type: "string", private: true, writable: true },
      content_type: { type: "string", default: "json", writable: true },
      insecure_ssl: { type: "boolean", default: false },
      active: { type: "boolean", default: true, writable: true }
    };
  }

  static get addMethodName() {
    return "_addHook";
  }

  constructor(owner, name, events = new Set(["*"]), options) {
    super(owner, name, options, {
      events: { value: events }
    });
  }

  /**
   * Provide name, events and all defined attributes.
   */
  toJSON() {
    return optionJSON(this, { name: this.name, id: this.id, events: [...this.events] });
  }
}
