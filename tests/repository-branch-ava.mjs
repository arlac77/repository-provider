import test from "ava";
import {
  repositoryEqualityTest,
  createMessageDestination
} from "repository-provider-test-support";
import {
  SingleGroupProvider,
  Repository,
  Branch,
  PullRequest
} from "repository-provider";

test("repository add branch", t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1");
  const b1 = repository.addBranch("b1", {});

  t.is(b1.name, "b1");
});
