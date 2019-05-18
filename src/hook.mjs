import { definePropertiesFromOptions } from "./util.mjs";

/**
 * @property {Repository} repository
 * @property {URL} url
 * @property {Set<string>} events
 */
export class Hook {
  static get defaultOptions() {
    return {
      secret: "",
      content_type: "json",
      active: true
    };
  }

  constructor(repository, url, events = new Set(["*"]), options) {
    definePropertiesFromOptions(this, options, {
      repository: { value: repository },
      events: { value: events },
      url: { value: url }
    });
  }
}
