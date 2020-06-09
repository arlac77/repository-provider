import test from "ava";
import { repositoryEqualityTest } from "repository-provider-test-support";
import {
  SingleGroupProvider,
  Repository,
  Branch,
  PullRequest
} from "repository-provider";

test("repository init with options", async t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1", {
    description: "a description",
    id: "4711",
    uuid: "12345"
  });
  t.is(repository.owner, provider);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
  t.is(repository.type, "git");
  t.is(repository.description, "a description");
  t.is(repository.id, "4711");
  t.is(repository.uuid, "12345");
  t.is(repository.issuesURL, undefined);
  t.is(repository.homePageURL, undefined);
  t.is(repository.isArchived, false);
  t.is(repository.toString(), "r1");
  t.deepEqual(repository.toJSON(), {
    defaultBranchName: "master",
    description: "a description",
    id: "4711",
    uuid: "12345",
    name: "r1",
    fullName: "r1",
    isArchived: false,
    isDisabled: false,
    isLocked: false,
    isTemplate: false,
    urls: []
  });

  t.deepEqual(await repository.tags().next(), { done: true, value: undefined });
  t.deepEqual(await repository.hooks().next(), {
    done: true,
    value: undefined
  });
  t.deepEqual(await repository.branches().next(), {
    done: true,
    value: undefined
  });
  t.deepEqual(await repository.pullRequests().next(), {
    done: true,
    value: undefined
  });
});

test("repository init with more options", async t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1", {
    fullName: "g1/r1",
    description: "a description",
    id: "4712",
    uuid: "12345",
    isArchived: true,
    isTemplate: true,
    urls: ["http:/myprovider/orner1/r1.git"]
  });

  t.is(repository.owner, provider);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
  t.is(repository.type, "git");
  t.is(repository.id, "4712");
  t.is(repository.description, "a description");
  t.is(repository.isArchived, true);
  t.is(repository.isTemplate, true);
  t.deepEqual(repository.urls, ["http:/myprovider/orner1/r1.git"]);
});

test("repository init without options", t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1");
  t.is(repository.owner, provider);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
  t.is(`${repository}`, "r1");
  t.is(repository.type, "git");
  t.is(repository.description, undefined);
});

test("repository normalize name", t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1#branch");
  t.is(repository.owner, provider);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
});

test("repository branch create", async t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1#branch");
  const b1 = await repository.createBranch("b1");
  t.is(b1.name, "b1");
  t.is(b1.repository, repository);
  t.is(b1, await repository.createBranch("b1"));
});

test("repository classes", t => {
  const provider = new SingleGroupProvider();
  const repository = new Repository(provider, "r1#branch");
  t.is(repository.branchClass, Branch);
  t.is(repository.entryClass, undefined);
  t.is(repository.pullRequestClass, PullRequest);
});

class MyRepository extends Repository {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      myAttribute: 77
    };
  }
}

test("defaultOption", t => {
  const repository = new MyRepository(new SingleGroupProvider(), "r1", { id: "xxx" });
  t.is(repository.myAttribute, 77);
  t.is(repository.id, "xxx");
});

test(repositoryEqualityTest, new SingleGroupProvider(), "r1", "r2");
