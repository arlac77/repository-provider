import { Ref } from "./ref.mjs";

/**
 * Tag refs
 */
export class Tag extends Ref {
  constructor(repository, name, options) {
    super(repository, name, options);
    repository._addTag(this);
  }

  get refType() {
    return "tags";
  }

  /**
   * 
   * @return {boolean} false
   */
  get isWritable()
  {
    return false;
  }

}
