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

/**
 * Unique id.
 */
export const uuid = { isKey: true, type: "string" };

export const state = { type: "string" };

export const secret = { type: "string", private: true, writable: true };

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
