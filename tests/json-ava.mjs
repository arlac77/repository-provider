import test from "ava";
import { RepositoryGroup, MultiGroupProvider } from "repository-provider";

test("JSON", t => {
  const rg = new RepositoryGroup(new MultiGroupProvider(), "a", { id: 1 });

  t.deepEqual(rg.toJSON(), {
    id: 1,
    isAdmin: false,
    name: "a"
  });
});
