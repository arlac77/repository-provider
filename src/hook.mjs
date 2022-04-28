import { optionJSON } from "./attribute.mjs";
import { NamedObject } from "./named-object.mjs";
import { Repository } from "./repository.mjs";

/**
 * Repository hook.
 * @param {Repository} repository
 * @param {string} id
 * @param {Set<string>} events
 * @param {Object} options
 * 
 * @property {Repository} repository
 * @property {URL} url
 * @property {Set<string>} events
 */
export class Hook extends NamedObject {
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

  constructor(repository, name, events = new Set(["*"]), options) {
    super(name, options, {
      repository: { value: repository },
      events: { value: events }
    });

    repository._addHook(this);
  }

  get owner()
  {
    return this.repository;
  }

  /**
   * Check for equality.
   * @param {Hook} other
   * @return {boolean} true if name and repository are equal
   */
  equals(other) {
    return super.equals(other) && this.repository.equals(other.repository);
  }

  /**
   * Provide name, events and all defined attributes.
   */
  toJSON() {
    return optionJSON(this, { name: this.name, id: this.id, events: [...this.events] });
  }
}
