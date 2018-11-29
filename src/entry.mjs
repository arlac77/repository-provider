import toReadableStream from "to-readable-stream";
import { Stream } from "stream";

/**
 * Representation of one file or directory entry
 * All names are asolute (no leading '/') and build with '/'
 * @property {string} name file name inside of the repository
 *
 * @param {string} name file name inside of the repository
 */
export class BaseEntry {
  constructor(name) {
    if (name[0] === "/" || name.indexOf("\\") >= 0) {
      throw new TypeError(
        `Names should not contain leading '/' or any '\\': ${name}`
      );
    }

    Object.defineProperties(this, {
      name: { value: name }
    });
  }

  /**
   *
   * @return {string[]} UTI types
   */
  async getTypes() {
    return [];
  }

  get isDirectory() {
    return false;
  }

  toJSON() {
    return {
      name: this.name
    };
  }
}

/**
 * brings Directory attributes
 */
export function DirectoryEntryMixin(superclass) {
  return class DirectoryEntryMixin extends superclass {
    get isDirectory() {
      return true;
    }

    async getTypes() {
      return ["public.directory"];
    }
  };
}

export const BaseDirecotryEntry = DirectoryEntryMixin(BaseEntry);


/**
 * Representation of one file or directory entry
 * All names are asolute (no leading '/') and build with '/'
 * @property {string} name file name inside of the repository
 * @property {string|Buffer|Stream} content
 * @property {string} type type of the content
 * @property {string} mode file permissions
 * @property {string} sha sha of the content
 *
 * @param {string} name file name inside of the repository
 * @param {string|Buffer|Stream} content
 * @param {string} type type of the content
 * @param {string} mode file permissions
 * @param {string} sha sha of the content
 */
export class Entry extends BaseEntry {
  static get TYPE_BLOB() {
    return "blob";
  }

  static get TYPE_TREE() {
    return "tree";
  }

  constructor(
    name,
    content = undefined,
    type = Entry.TYPE_BLOB,
    mode = "100644",
    sha
  ) {
    super(name);

    Object.defineProperties(this, {
      content: {
        get() {
          return content;
        },
        set(value) {
          content = value;
        }
      },
      sha: {
        get() {
          return sha;
        },
        set(value) {
          sha = value;
        }
      },
      type: { value: type },
      mode: { value: mode }
    });
  }

  /**
   * Deliver content as string
   * @return {string} content
   */
  async getString() {
    if (typeof this.content === "string" || this.content instanceof String) {
      return this.content;
    }

    if (Buffer.isBuffer(this.content)) {
      return this.content.toString("utf8");
    }

    return undefined;
  }

  async getBuffer() {
    if (Buffer.isBuffer(this.content)) {
      return this.content;
    }

    return undefined;
  }

  /**
   * Deliver content as read stream
   * @return {ReadableStream} content
   */
  async getReadStream() {
    return this.content instanceof Stream
      ? this.content
      : toReadableStream(this.content);
  }

  toJSON() {
    return Object.assign(
      {
        type: this.type,
        mode: this.mode,
        sha: this.sha
      },
      super.toJSON()
    );
  }

  /**
   * compare meta info against other entry
   * @param {Entry} other
   * @return {boolean} true if other has the same meta information (name...)
   */
  async equalsMeta(other) {
    return (
      other !== undefined &&
      (this.name === other.name &&
        this.type === other.type &&
        this.mode === other.mode)
    );
  }

  /**
   * compare content against other entry
   * @param {Entry} other
   * @return {boolean} true if other has the same content (bitwise)
   */
  async equalsContent(other) {
    if (Buffer.isBuffer(this.content)) {
      if (Buffer.isBuffer(other.content)) {
        return this.content.equals(other.content);
      }
    }

    const [a, b] = await Promise.all([this.getString(), other.getString()]);
    return a === b;
  }

  /**
   * compare against other entry
   * @param {Entry} other
   * @return {boolean} true if other describes the same content
   */
  async equals(other) {
    return (await this.equalsMeta(other)) && (await this.equalsContent(other));
  }

  /*** DEPRECATED methods properties follow */

  /**
   * Deliver content as string
   * @return {string} content
   */
  toString() {
    console.log(
      `${
        this.constructor.name
      }: toString() is deprecated use getString() instead`
    );
  }

  /**
   * @return {boolean} true if content represents a directory
   */
  get isDirectory() {
    console.log(`${this.constructor.name}: isDirectory is deprecated`);

    return this.type === Entry.TYPE_TREE;
  }

  /**
   * @return {boolean} true if content represents a blob (plain old file)
   */
  get isFile() {
    console.log(`${this.constructor.name}: isFile is deprecated`);

    return this.type === Entry.TYPE_BLOB;
  }

  /**
   * deprecated is name instead
   */
  get path() {
    console.log(
      `${this.constructor.name}: path is deprecated use name instead`
    );
    return this.name;
  }
}

/**
 * Create empty content (file)
 * @param {string} name
 * @return {Entry}
 */
export function emptyEntry(name, options) {
  return new Entry(name, "");
}
