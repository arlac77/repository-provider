import {
  secret_attribute,
  boolean_attribute,
  active_attribute,
  url_attribute_writable,
  string_attribute_writable,
  string_set_attribute_writable
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
    url: { ...url_attribute_writable, description: "target url" },
    content_type: { ...string_attribute_writable, default: "json" },
    insecure_ssl: boolean_attribute,
    events: {
      ...string_set_attribute_writable,
      default: this.defaultEvents
    }
  };

  set events(value) {
    this._events = value instanceof Set ? value : new Set(value);
  }

  get events() {
    return this._events;
  }

  static get addMethodName() {
    return "_addHook";
  }

  static get delteteMethodName() {
    return "_deleteHook";
  }
}
