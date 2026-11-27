import { addType } from "pacc";
import { Ref } from "./ref.mjs";

/**
 * Tag refs
 */
export class Tag extends Ref {
  static get addMethodName() {
    return "_addTag";
  }

  static get deleteMethodName() {
    return "_deleteTag";
  }

  static {
    addType(this);
  }

  /**
   * @return {string} tags
   */
  get refType() {
    return "tags";
  }
}
