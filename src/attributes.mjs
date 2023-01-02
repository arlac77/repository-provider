export const boolean_attribute = {
  type: "boolean",
  default: false,
  writable: true
};

export const boolean_read_only_attribute = {
  type: "boolean",
  default: false
};

export const uuid_attiribute = { isKey: true, type: "string" };
export const empty_attiribute = { type: "boolean" };
export const secret_attribute = {
  type: "string",
  private: true,
  writable: true
};
export const size_attribute = { type: "integer" };

export const url = { description: "home of the object", type: "url" };

/**
 * The description of the object content.
 */
export const description = {
  type: "string",
  description: "human readable description",
  writable: true
};

export const name = {
  type: "string",
  isKey: true
};

/**
 * Unique id within the provider.
 */
export const id = { isKey: true, type: "string" };

export const state = { type: "string" };

/**
 * The description of the pull request.
 */
export const body = { type: "string", writable: true };

/**
 * The one line description of the pull request.
 */
export const title = {
  type: "string",
  description: "human readable title",
  writable: true
};

/**
 * In case there are several providers able to support a given source which one sould be used ?
 * this defines the order
 */
export const priority = {
  type: "number",
  default: 0,
  writable: true
};

export const active = { type: "boolean", default: true, writable: true };
export const language = { type: "string" };
export const type = { type: "string" };
