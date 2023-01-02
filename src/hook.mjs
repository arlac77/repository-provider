import { OwnedObject } from "./owned-object.mjs";
import {
  secret_attribute,
  boolean_attribute,
  active,
  url_attribute
} from "./attributes.mjs";

/**
 * Repository hook.
 */
export class Hook extends OwnedObject {
  static get attributes() {
    return {
      ...super.attributes,
      active,
      secret: secret_attribute,
      url: { ...url_attribute, description: "target url", writable: true },
      content_type: { type: "string", default: "json", writable: true },
      insecure_ssl: boolean_attribute,
      events: { type: "set", default: new Set(["*"]) }
    };
  }

  static get addMethodName() {
    return "_addHook";
  }

  static get delteteMethodName() {
    return "_deleteHook";
  }
}
