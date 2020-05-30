import { Ref } from "./ref.mjs";

export class Tag extends Ref {
  constructor(repository, name, options) {
    super(repository, name, options);
    repository._addTag(this);
  }

  get refType() {
    return "tags";
  }
}
