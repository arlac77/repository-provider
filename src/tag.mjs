import { Ref } from "./ref.mjs";

/**
 * Tag refs
 */
export class Tag extends Ref {

  static get addMethodName() {
    return "_addTag";
  }

  /**
   * @return {string} tags
   */
  get refType() {
    return "tags";
  }
}
