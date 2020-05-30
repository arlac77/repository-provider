import test from "ava";
import { Tag, Provider } from "repository-provider";

test("tag init", async t => {
  const provider = new Provider();
  const repository = await provider.addRepository("r1", {
  });

  const b = new Tag(repository, "t1");

  t.is(b.repository, repository);
  t.is(b.provider, provider);
  t.is(b.name, "t1");
  t.is(b.owner, provider);
  t.is(b.ref, "refs/tags/t1");
  t.is(b.entryClass, undefined);
 // t.is(await repository.tags("t1"), b);
});
