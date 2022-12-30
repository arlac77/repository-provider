import { OwnedObject } from "./owned-object.mjs";
import { secret, active, url } from "./attributes.mjs";

/**
 * Repository hook.
 */
export class Hook extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      active,
      secret,
      url: { ...url, description: "target url", writable: true },
      content_type: { type: "string", default: "json", writable: true },
      insecure_ssl: { type: "boolean", default: false },
      events: { type: "set", default: new Set(["*"]) }
    };
  }

  static get addMethodName() {
    return "_addHook";
  }
}
