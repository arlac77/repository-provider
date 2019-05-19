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
  }

  /**
   * provide name and all defined defaultOptions
   */
  toJSON() {
    return optionJSON(this, { name: this.name, events: [...this.events] });
  }
}
