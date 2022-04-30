import { Ref } from "./ref.mjs";

/**
 * Tag refs
 */
export class Tag extends Ref {

  static get registerInstanceMethodName() {
    return "_addTag";
  }

  /**
   * @return {string} tags
   */
  get refType() {
    return "tags";
  }
}
