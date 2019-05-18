import test from "ava";
import { Owner } from "../src/owner.mjs";
import { Repository } from "../src/repository.mjs";
import { Hook } from "../src/hook.mjs";

test("add hook", t => {
  const repository = new Repository(new Owner(), "r1");

  const hook = new Hook(repository, "http://somewere.com/path",new Set(['a']));

  t.is(hook.url, "http://somewere.com/path");
  t.deepEqual(hook.events, new Set(['a']));
  t.is(hook.repository, repository);
});
