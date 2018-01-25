/**
 * Respresentation of one 'file' entry
 * @property {string|Buffer|Stream} content
 * @property {string} path file name inside of the repository
 * @property {string} type tpye of the content
 * @property {string} mode file permissions
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
