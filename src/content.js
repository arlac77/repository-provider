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
  constructor(path, content = undefined, type = 'blob', mode = '100644') {
    Object.defineProperties(this, {
      path: { value: path },
      content: { value: content, writeable: true },
      type: { value: type },
      mode: { value: mode }
    });
  }
}
