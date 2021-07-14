import { optionJSON } from "./attribute.mjs";
import { BaseObject } from "./base-object.mjs";

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
export class Hook extends BaseObject {
  static get attributes() {
    return {
      ...super.attributes,
      name: { type: "string" },
      url: { type: "url", description: "target url" },
      secret: { type: "string", private: true },
      content_type: { type: "string", default: "json" },
      insecure_ssl: { type: "boolean", default: false },
      active: { type: "boolean", default: true }
    };
  }

  constructor(repository, id, events = new Set(["*"]), options) {
    super(options, {
      id: { value: id },
      repository: { value: repository },
      events: { value: events }
    });

    repository._addHook(this);
  }

  get fullName() {
    return `${this.repository.fullName}/${this.id}`;
  }

  get displayName() {
    return this.id;
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
    return optionJSON(this, { id: this.id, events: [...this.events] });
  }
}
