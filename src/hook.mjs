import { OwnedObject } from "./owned-object.mjs";

/**
 * Repository hook.
 */
export class Hook extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      url: { type: "url", description: "target url", writable: true },
      secret: { type: "string", private: true, writable: true },
      content_type: { type: "string", default: "json", writable: true },
      insecure_ssl: { type: "boolean", default: false },
      active: { type: "boolean", default: true, writable: true },
      events: { type: "set", default: new Set(["*"]) }
    };
  }

  static get addMethodName() {
    return "_addHook";
  }
}
