/**
 * @property {string|Buffer} content
 * @property {string} path file name inside of the repository
 * @property {string} type tpye of the content
 * @property {string} mode file permissions
 */
export class Content {
  constructor(path, content = undefined, type = 'file', mode = '0640') {
    Object.defineProperties(this, {
      path: { value: path },
      content: { value: content, writeable: true },
      type: { value: type },
      mode: { value: type }
    });
  }
}
