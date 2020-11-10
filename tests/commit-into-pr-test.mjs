import test from "ava";
import { SingleGroupProvider } from "repository-provider";

test("commit with PR", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest(
    { message: "my message", entries: [] },
    {
      pullRequestBranch: "pr1",
      title: "a title"
    }
  );

  t.true(pr.number !== undefined);
  t.is(pr.title, "a title");
});

test("commit with PR DRY", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest(
    { message: "my message", entries: [] },
    {
      pullRequestBranch: "pr1",
      title: "a title",
      dry: true
    }
  );

  t.is(pr.number, "DRY");
  t.is(pr.title, "a title");
  t.is(pr.identifier, "SingleGroupProvider:r1[DRY]");
});

test("commit with PR EMPTY", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest(
    undefined,
    {
      pullRequestBranch: "pr1",
      title: "a title"
    }
  );

  t.is(pr.number, "EMPTY");
  t.is(pr.title, "a title");
  t.is(pr.identifier, "SingleGroupProvider:r1[EMPTY]");
});

async function* commits() {
  yield { message: "m1", entries: [] };
  yield { message: "m2", entries: [] };
}

test("iterator commit with PR", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest(commits(), {
    pullRequestBranch: "pr1",
    title: "a title",
    body: "a body"
  });

  t.true(pr.number !== undefined);
  t.is(pr.title, "a title");
  t.is(pr.body, "a body");
});

test("iterator commit with PR bodyFromCommitMessages", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest(commits(), {
    pullRequestBranch: "pr1",
    title: "a title",
    bodyFromCommitMessages: true
  });

  t.true(pr.number !== undefined);
  t.is(pr.title, "a title");
  t.is(pr.body, `
---
- m1


---
- m2

`);
  
});

test("iterator commit with PR DRY", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest(commits(), {
    pullRequestBranch: "pr1",
    title: "a title",
    dry: true
  });

  t.is(pr.number, "DRY");
  t.is(pr.title, "a title");
  t.is(pr.identifier, "SingleGroupProvider:r1[DRY]");
});
