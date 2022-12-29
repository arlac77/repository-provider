export const url = { description: "home of the object", type: "url" };


/**
 * The description of the object content.
 * @return {string}
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
 * @return {string}
 */
export const id = { isKey: true, type: "string" };

/**
 * Unique id.
 * @return {string}
 */
export const uuid = { isKey: true, type: "string" };


export const state = { type: "string" };

export const secret = { type: "string", private: true, writable: true };
   
