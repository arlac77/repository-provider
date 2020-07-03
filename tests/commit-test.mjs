import test from "ava";
import { Commit, SingleGroupProvider, Repository } from "repository-provider";

test("init commit", async t => {
  const repository = new Repository(new SingleGroupProvider(), "r1");
  const c = new Commit(repository);
  t.is(c.repository, repository);
});
