import { optionJSON } from "./attribute.mjs";
import { NamedObject } from "./named-object.mjs";

/**
 * @property {Repository} repository
 * @property {URL} url
 * @property {Set<string>} events
 */
export class Hook extends NamedObject {
  static get attributes() {
    return {
      ...super.attributes,
      url: { description: "target url" },
      secret: { private: true },
      content_type: { default: "json" },
      insecure_ssl: { default: false },
      active: { type: "boolean", default: true }
    };
  }

  constructor(repository, name, events = new Set(["*"]), options) {
    super(name, options, {
      repository: { value: repository },
      events: { value: events }
    });

    repository._addHook(this);
  }

  /**
   * Check for equality
   * @param {Hook} other
   * @return {boolean} true if name and repository are equal
   */
  equals(other) {
    return super.equals(other) && this.repository.equals(other.repository);
  }

  /**
   * provide name, events and all defined attributes
   */
  toJSON() {
    return optionJSON(this, { name: this.name, events: [...this.events] });
  }
}
