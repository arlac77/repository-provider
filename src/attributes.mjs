/**
 * @typedef {import('pacc').AttributeDefinition} AttributeDefinition
 */

/**
 * Common attribute properties.
 * @type {AttributeDefinition}
 */
export const default_attribute = {
  type: "string",
  writable: false,
  mandatory: false,
  private: false,
  isKey: false,
  additionalAttributes: [],
  env: []
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_attribute = {
  ...default_attribute,
  writable: true,
  default: false,
  type: "boolean"
};

/**
 * @type {AttributeDefinition}
 */
export const boolean_read_only_attribute = {
  ...default_attribute,
  type: "boolean",
  default: false
};

/**
 * @type {AttributeDefinition}
 */
export const uuid_attribute = {
  ...default_attribute,
  isKey: true
};

/**
 * @type {AttributeDefinition}
 */
export const empty_attiribute = { ...default_attribute, type: "boolean" };

/**
 * @type {AttributeDefinition}
 */
export const secret_attribute = {
  ...default_attribute,
  private: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const count_attribute = { ...default_attribute, type: "integer" };

/**
 * @type {AttributeDefinition}
 */
export const size_attribute = { ...default_attribute, type: "integer" };

/**
 * @type {AttributeDefinition}
 */
export const name_attribute = {
  ...default_attribute,
  isKey: true
};

/**
 * @type {AttributeDefinition}
 */
export const url_attribute = {
  ...default_attribute,
  description: "home of the object",
  type: "url"
};

/**
 * The description of the object content.
 * @type {AttributeDefinition}
 */
export const description_attribute = {
  ...default_attribute,
  description: "human readable description",
  writable: true
};

/**
 * Unique id within the provider.
 * @type {AttributeDefinition}
 */
export const id_attribute = {
  ...default_attribute,
  isKey: true,
  description: "internal identifier"
};

/**
 * @type {AttributeDefinition}
 */
export const state_attribute = {
  ...default_attribute,
  writable: true
};

/**
 * The description of the pull request.
 * @type {AttributeDefinition}
 */
export const body_attribute = {
  ...default_attribute,
  writable: true
};

/**
 * The one line description of the pull request.
 * @type {AttributeDefinition}
 */
export const title_attribute = {
  ...default_attribute,
  description: "human readable title",
  writable: true
};

/**
 * In case there are several providers able to support a given source which one sould be used ?
 * this defines the order.
 * @type {AttributeDefinition}
 */
export const priority_attribute = {
  ...default_attribute,
  type: "number",
  default: 0,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const active_attribute = {
  ...default_attribute,
  type: "boolean",
  default: true,
  writable: true
};

/**
 * @type {AttributeDefinition}
 */
export const language_attribute = default_attribute;

/**
 * @type {AttributeDefinition}
 */
export const type_attribute = default_attribute;
