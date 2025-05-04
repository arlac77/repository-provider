import test from "ava";
import { Commit, SingleGroupProvider, Repository } from "repository-provider";

test("init commit", t => {
  const repository = new Repository(new SingleGroupProvider(), "r1");
  const c = new Commit(repository, { message: "a message", sha: "abc" });
  t.is(c.repository, repository);
  t.is(c.message, "a message");
  t.is(c.sha, "abc");
});
