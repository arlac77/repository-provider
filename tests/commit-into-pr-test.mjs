import test from "ava";
import { SingleGroupProvider } from "repository-provider";

test("commit with PR", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest("my message", [], {
    pullRequestBranch: "pr1",
    title: "a title"
  });

  t.true(pr.number !== undefined);
  t.is(pr.title, "a title");
});

test("commit with PR DRY", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest("my message", [], {
    pullRequestBranch: "pr1",
    title: "a title",
    dry: true
  });

  t.is(pr.number, "DRY");
  t.is(pr.title, "a title");
  t.is(pr.identifier, "SingleGroupProvider:r1[DRY]");
});
