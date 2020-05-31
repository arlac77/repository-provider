import { definePropertiesFromOptions, optionJSON } from "./util.mjs";
import { NamedObject } from "./named-object.mjs";

/**
 * @property {Repository} repository
 * @property {URL} url
 * @property {Set<string>} events
 */
export class Hook extends NamedObject {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: undefined,
      url: "",
      secret: undefined,
      content_type: "json",
      insecure_ssl: false,
      active: true
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
   * provide name, events and all defined defaultOptions
   */
  toJSON() {
    return optionJSON(this, { name: this.name, events: [...this.events] });
  }
}
