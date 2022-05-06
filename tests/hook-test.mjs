import test from "ava";
import { createMessageDestination } from "repository-provider-test-support";
import { SingleGroupProvider, Repository, Hook } from "repository-provider";

test("add hook", async t => {
  const repository = new Repository(new SingleGroupProvider(), "r1");

  const hook = new Hook(repository, "hook1", new Set(["a"]), {
    id: 77,
    url: "http://somewere.com/path"
  });

  t.is(hook.owner, repository);

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
  t.is(hook.displayName, "hook1");
  t.is(hook.fullName, "r1/hook1");
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

  t.true(hook.equals(hook));
  t.false(hook.equals(undefined));
  t.false(hook.equals({}));
});

test("hook logging", async t => {
  const { messageDestination, messages, levels } = createMessageDestination();
  const provider = new SingleGroupProvider({ messageDestination });

  const repository = await provider.addRepository("r1");
  const hook = new Hook(repository, "hook1", new Set(["a"]));

  for (const l of levels) {
    hook[l](l);
    t.deepEqual(messages[l], [l], l);
  }
});
