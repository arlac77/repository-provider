import test from "ava";
import { Owner } from "../src/owner.mjs";
import { Repository } from "../src/repository.mjs";
import { Hook } from "../src/hook.mjs";

test("add hook", t => {
  const repository = new Repository(new Owner(), "r1");

  const hook = new Hook(repository, "hook1", new Set(["a"]), {
    id: 77,
    url: "http://somewere.com/path"
  });

  t.is(hook.repository, repository);
  t.is(hook.name, "hook1");
  t.deepEqual(hook.events, new Set(["a"]));

  t.is(hook.id, 77);
  t.is(hook.active, true);
  t.is(hook.url, "http://somewere.com/path");
  t.deepEqual(hook.toJSON(), {
    name: "hook1",
    active: true,
    id: 77,
    events: ['a'],
    insecure_ssl: false,
    content_type: 'json',
    url: "http://somewere.com/path"
  });
});
