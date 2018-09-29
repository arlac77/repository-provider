/**
 * Representation of one file or directory entry
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
    Object.defineProperties(this, {
      path: { value: path },
      content: { value: content, writeable: true },
      type: { value: type },
      mode: { value: mode }
    });
  }

  get isDirectory() {
    return this.type === Content.TYPE_TREE;
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

    } else {
      if (this.content === undefined && other.content === undefined) {
        return true;
      }
    }

    console.log(`not implemented: ${typeof this.content} <> ${typeof other.content}`);
    return false;
  }
}

/**
 *
 * @param {string} path
 * @return {Content}
 */
export function emptyContent(path, options) {
  return new Content(path, "");
}
