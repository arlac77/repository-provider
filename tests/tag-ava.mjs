import test from "ava";
import { createMessageDestination } from "repository-provider-test-support";
import { Tag, SingleGroupProvider } from "repository-provider";

test("Tag type", t => t.is(Tag.type, "tag"));
test("Tag collection name", t => t.is(Tag.collectionName, "tags"));

test("tag init", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1", {});

  const b = new Tag(repository, "t1");

  t.is(b.repository, repository);
  t.is(b.provider, provider);
  t.is(b.owner, repository);

  t.is(b.name, "t1");
  t.is(b.ref, "refs/tags/t1");
  t.is(b.isWritable, false);
  t.is(b.entryClass, undefined);
  // t.is(await repository.tags("t1"), b);

  t.is(b.identifier, "SingleGroupProvider:r1#t1");
  t.is(b.toString(), "SingleGroupProvider:r1#t1");
});

test("tag addTag", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1", {});

  const b = repository.addTag("t1");
  t.is(b.repository, repository);
  t.is(b.provider, provider);
  t.is(b.owner, repository);
  t.is(b.name, "t1");
  t.is(b.ref, "refs/tags/t1");
  t.is(b.isWritable, false);
});

test("tag logging", async t => {
  const { messageDestination, messages, levels } = createMessageDestination();
  const provider = new SingleGroupProvider({ messageDestination });

  const repository = await provider.addRepository("r1");
  const tag = new Tag(repository, "t1");

  for (const l of levels) {
    tag[l](l);
    t.deepEqual(messages[l], [l], l);
  }
});
