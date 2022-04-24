import { Ref } from "./ref.mjs";

/**
 * Tag refs
 */
export class Tag extends Ref {
  constructor(repository, name, options) {
    super(repository, name, options);
    repository._addTag(this);
  }

  /**
   * @return {string} tags
   */
  get refType() {
    return "tags";
  }

  /**
   * Tags cannot be written to.
   * @return {boolean} false
   */
  get isWritable()
  {
    return false;
  }
}