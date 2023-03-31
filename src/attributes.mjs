/**
 * common attributes
 */
export const default_attribute = {
  type: "string",
  writeable: false,
  mandatory: false,
  private: false,
  isKey: false,
  additionalAttributes: []
};

export const boolean_attribute = {
  ...default_attribute,
  writeable: true,
  default: false,
  type: "boolean"
};

export const boolean_read_only_attribute = {
  ...default_attribute,
  type: "boolean",
  default: false
};

export const uuid_attiribute = {
  ...default_attribute,
  isKey: true
};
export const empty_attiribute = { ...default_attribute, type: "boolean" };
export const secret_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};
export const count_attribute = { ...default_attribute, type: "integer" };
export const size_attribute = { ...default_attribute, type: "integer" };
export const name_attribute = {
  ...default_attribute,
  isKey: true
};

export const url_attribute = {
  ...default_attribute,
  description: "home of the object",
  type: "url"
};

/**
 * The description of the object content.
 */
export const description_attribute = {
  ...default_attribute,
  description: "human readable description",
  writable: true
};

/**
 * Unique id within the provider.
 */
export const id_attribute = {
  ...default_attribute,
  isKey: true,
  description: "internal identifier"
};

export const state_attribute = {
  ...default_attribute,
  writeable: true
};

/**
 * The description of the pull request.
 */
export const body_attribute = {
  ...default_attribute,
  writable: true
};

/**
 * The one line description of the pull request.
 */
export const title_attribute = {
  ...default_attribute,
  description: "human readable title",
  writable: true
};

/**
 * In case there are several providers able to support a given source which one sould be used ?
 * this defines the order
 */
export const priority_attribute = {
  ...default_attribute,
  type: "number",
  default: 0,
  writable: true
};

export const active_attribute = {
  ...default_attribute,
  type: "boolean",
  default: true,
  writable: true
};
export const language_attribute = default_attribute;
export const type_attribute = default_attribute;
