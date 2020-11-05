import test from "ava";
import {
  RepositoryOwner,
  NamedObject
} from "repository-provider";

const MyOwnerClass = RepositoryOwner(NamedObject);

test("RepositoryOwner create",t => {
  const owner = new MyOwnerClass();

  t.truthy(owner);
});