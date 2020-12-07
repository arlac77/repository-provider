import test from "ava";
import { SingleGroupProvider, Repository, Hook } from "repository-provider";

test("add hook", async t => {
  const repository = new Repository(new SingleGroupProvider(), "r1");

  const hook = new Hook(repository, 77, new Set(["a"]), {
    name: "hook1",
    url: "http://somewere.com/path"
  });

  t.is(hook.repository, repository);

  t.is(repository._hooks.length, 1);

  t.is(await repository.hook(77), hook);
  t.is(await repository.hook("77"), hook);

  /*
  let n = 0;
  for await (const h of repository.hooks()) {
    t.is(h.repository, repository);
    n++;
  }
  t.is(n, 1);
  */
  t.is(hook.name, "hook1");
  t.is(hook.displayName, 77);
  t.is(hook.fullName, "r1/77");
  t.deepEqual(hook.events, new Set(["a"]));

  t.is(hook.id, 77);
  t.is(hook.active, true);
  t.is(hook.url, "http://somewere.com/path");
  t.deepEqual(hook.toJSON(), {
    name: "hook1",
    active: true,
    id: 77,
    events: ["a"],
    insecure_ssl: false,
    content_type: "json",
    url: "http://somewere.com/path"
  });
});
