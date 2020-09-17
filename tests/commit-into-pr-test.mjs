import test from "ava";
import { SingleGroupProvider } from "repository-provider";

test("pullRequest list", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");
  const branch = await repository.createBranch("master");
  const pr = await branch.commitIntoPullRequest("my message", [], {
    pullRequestBranch: "pr1"
  });

  t.true(pr.number !== undefined);
});
