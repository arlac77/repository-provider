/**
 * Representation of one file or directory entry
 * All paths are asolute (no leading '/') and build with '/'
 * @property {string} path file name inside of the repository
 * @property {string|Buffer|Stream} content
 * @property {string} type type of the content
 * @property {string} mode file permissions
 *
 * @param {string} path file name inside of the repository
 * @param {string|Buffer|Stream} content
 * @param {string} type type of the content
 * @param {string} mode file permissions
 */
export class Content {
  static get TYPE_BLOB() {
    return "blob";
  }
  static get TYPE_TREE() {
    return "tree";
  }

  constructor(
    path,
    content = undefined,
    type = Content.TYPE_BLOB,
    mode = "100644"
  ) {
    if (path[0] === "/" || path.indexOf("\\") >= 0) {
      throw new TypeError(
        `Paths should not contain leading '/' or any '\\': ${path}`
      );
    }

    Object.defineProperties(this, {
      path: { value: path },
      content: { value: content, writeable: true },
      type: { value: type },
      mode: { value: mode }
    });
  }

  /**
   * @return {boolean} true is content represents a directory
   */
  get isDirectory() {
    return this.type === Content.TYPE_TREE;
  }

  /**
   * @return {boolean} true is content represents a blob (plain old file)
   */
  get isFile() {
    return this.type === Content.TYPE_BLOB;
  }

  /**
   * Deliver content as string
   * @return {string} content
   */
  toString() {
    if (typeof this.content === "string" || this.content instanceof String) {
      return this.content;
    }

    if (Buffer.isBuffer(this.content)) {
      return this.content.toString("utf8");
    }

    return undefined;
  }

  toJSON() {
    return {
      path: this.path,
      type: this.type,
      mode: this.mode
    };
  }

  /**
   * compare against other content
   * @param {Content} other
   * @return {boolean} true if other describes the same content
   */
  equals(other) {
    if (
      other === undefined ||
      this.path !== other.path ||
      this.type !== other.type ||
      this.mode !== other.mode
    ) {
      return false;
    }

    if (Buffer.isBuffer(this.content)) {
      if (Buffer.isBuffer(other.content)) {
        return this.content.equals(other.content);
      }
    }

    return this.toString() === other.toString();
  }
}

/**
 * Create empty content (file)
 * @param {string} path
 * @return {Content}
 */
export function emptyContent(path, options) {
  return new Content(path, "");
}
