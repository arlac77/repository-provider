import test from "ava";
import { SingleGroupProvider, Repository, Branch, PullRequest } from "repository-provider";

test("branch init", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1", {
    urls: ["http://myprovider.com/r1"]
  });

  const b = new Branch(repository, "b1");

  t.is(b.repository, repository);
  t.is(b.provider, provider);
  t.is(b.name, "b1");
  t.is(b.slug, "SingleGroupProvider/r1");

  t.is(b.owner, provider);
  t.is(b.fullName, "r1#b1");
  t.is(b.fullCondensedName, "r1#b1");
  t.is(b.url, "http://myprovider.com/r1#b1");
  t.is(b.isDefault, false);
  t.is(b.isLocked, false);
  t.is(b.isArchived, false);
  t.is(b.isDisabled, false);
  t.is(b.isWritable, true);

  t.is(b.homePageURL, undefined);
  t.is(b.issuesURL, undefined);
  t.is(`${b}`, "SingleGroupProvider:r1#b1");
  t.is(b.ref, "refs/heads/b1");
  t.is(b.pullRequestClass, PullRequest);
  t.is(b.entryClass, undefined);
  t.is(await repository.branch("b1"), b);
});

test("branch init isDefault", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1", {
    urls: ["http://myprovider.com/r1"]
  });
  const b = new Branch(repository, "master");
  t.is(b.fullName, "r1#master");
  t.is(b.fullCondensedName, "r1");
  t.is(b.isDefault, true);
  t.is(b.url, "http://myprovider.com/r1");
});

test("branch isDefault changed", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1", {
    defaultBranchName: "otherMaster"
  });
  const b = new Branch(repository, "otherMaster");
  t.is(b.fullName, "r1#otherMaster");
  t.is(b.fullCondensedName, "r1");
  t.is(b.isDefault, true);
});

test("branch delete", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1");
  const branch = await repository.createBranch("b1");

  await branch.delete();

  t.is(await repository.branch("b1"), undefined);
});

test("branch entries", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1");

  const b = new Branch(repository, "b1");

  const entries = new Set();
  for await (const entry of b.entries(["*.js"])) {
    entries.add(entry.path);
  }

  t.is(entries.size, 0);
});

test("branch entries implicit async itrator", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1");

  const b = new Branch(repository, "b1");

  const entries = new Set();
  for await (const entry of b) {
    entries.add(entry.path);
  }

  t.is(entries.size, 0);
});

test("branch entry", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1");

  const b = new Branch(repository, "b1");

  await t.throwsAsync(async () => b.entry("aFile"), {
    instanceOf: Error,
    message: `No such entry 'aFile'`
  });

  t.is(await b.maybeEntry("aFile"), undefined);
});

test("branch create", async t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1");

  const b1 = await repository.createBranch("b1");
  const b2 = await b1.createBranch("b2");

  t.is(b2, await b1.createBranch("b2"));
});

test("branch equals", async t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1");

  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  t.true(b1.equals(b1));
  t.false(b1.equals(b2));
  t.false(b1.equals(undefined));
});
