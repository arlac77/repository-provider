import {
  secret_attribute,
  boolean_attribute,
  active_attribute,
  url_attribute,
  string_attribute
} from "pacc";
import { OwnedObject } from "./owned-object.mjs";

/**
 * Repository hook.
 */
export class Hook extends OwnedObject {
  static defaultEvents = new Set(["*"]);

  static attributes = {
    ...super.attributes,
    active: active_attribute,
    secret: secret_attribute,
    url: { ...url_attribute, description: "target url", writable: true },
    content_type: { ...string_attribute, default: "json", writable: true },
    insecure_ssl: boolean_attribute,
    events: { type: "set", default: this.defaultEvents }
  };

  static get addMethodName() {
    return "_addHook";
  }

  static get delteteMethodName() {
    return "_deleteHook";
  }
}
