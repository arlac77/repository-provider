import { definePropertiesFromOptions, optionJSON } from "./util.mjs";

/**
 * @property {Repository} repository
 * @property {URL} url
 * @property {Set<string>} events
 */
export class Hook {
  static get defaultOptions() {
    return {
      id: undefined,
      url: "",
      secret: undefined,
      content_type: "json",
      insecure_ssl: false,
      active: true
    };
  }

  constructor(repository, name, events = new Set(["*"]), options) {
    definePropertiesFromOptions(this, options, {
      repository: { value: repository },
      name: { value: name },
      events: { value: events }
    });

    repository.addHook(this);
  }

  /**
   * Check for equality
   * @param {Hook} other
   * @return {boolean} true if name and repository are equal
   */
  equals(other) {
    if (other === undefined) {
      return false;
    }

    return this.name === other.name && this.repository.equals(other.repository);
  }

  /**
   * provide name, events and all defined defaultOptions
   */
  toJSON() {
    return optionJSON(this, { name: this.name, events: [...this.events] });
  }
}
