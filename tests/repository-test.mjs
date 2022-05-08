import test from "ava";
import { repositoryEqualityTest, createMessageDestination } from "repository-provider-test-support";
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
  t.is(repository.slug, "SingleGroupProvider/r1");
  t.is(repository.fullName, "r1");
  t.is(repository.identifier, "SingleGroupProvider:r1");
  t.is(repository.type, "git");
  t.is(repository.description, "a description");
  t.is(repository.id, "4711");
  t.is(repository.uuid, "12345");
  t.is(repository.issuesURL, undefined);
  t.is(repository.homePageURL, undefined);
  t.is(repository.isArchived, false);
  t.is(repository.isFork, false);
  t.is(repository.isTemplate, false);
  t.is(repository.isDisabled, false);
  t.is(repository.hasBranches, false);
  t.is(repository.toString(), "r1");
  t.is(await repository.refId('branches/master'), undefined);
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
    isFork: false,
    urls: []
  });

  t.deepEqual(await repository.commits().next(), { done: true, value: undefined });
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
  static get attributes() {
    return {
      ...super.attributes,
      myAttribute: { default: 77 }
    };
  }
}

test("defaultOption", t => {
  const repository = new MyRepository(new SingleGroupProvider(), "r1", {
    id: "xxx"
  });
  t.is(repository.myAttribute, 77);
  t.is(repository.id, "xxx");
});

test(repositoryEqualityTest, new SingleGroupProvider(), "r1", "r2");

test("reposotory entry", async t => {
  const provider = new SingleGroupProvider();
  const repository = await provider.addRepository("r1");

  new Branch(repository, "master");

  await t.throwsAsync(async () => repository.entry("aFile"), {
    instanceOf: Error,
    message: `No such entry 'aFile'`
  });

  t.is(await repository.maybeEntry("aFile"), undefined);
});

test("repository logging", async t => {
  const { messageDestination, messages, levels } = createMessageDestination();
  const provider = new SingleGroupProvider({ messageDestination });

  const repository = await provider.addRepository("r1");

  for (const l of levels) {
    repository[l](l);
    t.deepEqual(messages[l], [l], l);
  }
});
