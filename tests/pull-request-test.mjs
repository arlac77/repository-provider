import test from "ava";
import { Provider, PullRequest } from "repository-provider";

test("pullRequest list", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  const prs = await repository.pullRequests;

  t.is(prs.length, 0);
});

test("pullRequest create numeric", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");
  const pr = new PullRequest(b1, b2, 4711);

  t.is(pr.number, "4711");
});

test("pullRequest create", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr = new PullRequest(b1, b2, "4711", {
    title: "a title",
    body: "the body",
    state: "closed",
    id: "123456"
  });

  t.is(pr.number, "4711");
  t.is(pr.source, b1);
  t.is(pr.destination, b2);
  t.is(pr.provider, provider);
  t.is(pr.title, "a title");
  t.is(pr.body, "the body");
  t.is(pr.state, "CLOSED");
  t.is(pr.locked, false);
  t.is(pr.merged, false);
  t.is(pr.id, "123456");
  t.is(
    `${pr}`,
    "4711: a title, source: r1#b1, destination: r1#b2, state: CLOSED, locked: false, merged: false"
  );

  t.is(await repository.pullRequest("4711"), pr);

  const prs = {};
  for await (const pr of repository.pullRequests()) {
    prs[pr.number] = pr;
  }

  t.is(prs[pr.number], pr);
});

test("pullRequest equal", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr1 = new PullRequest(b1, b2, "1");
  const pr1b = new PullRequest(b1, b2, "1");
  const pr2 = new PullRequest(b1, b2, "2");
  t.true(pr1.equals(pr1b));
  t.true(pr1.equals(pr1));
  t.false(pr1.equals(pr2));
});

test("pullRequest create without options", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr = new PullRequest(b1, b2, "4711");

  t.is(pr.number, "4711");
  t.is(pr.source, b1);
  t.is(pr.destination, b2);
  t.is(pr.locked, false);
  t.is(pr.merged, false);
  //t.is(pr.toString(), "p1: merged: false");

  t.is(pr.repository, repository);
});

test("pullRequest modify", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr = new PullRequest(b1, b2, "4711");

  pr.merged = true;
  t.is(pr.merged, true);
  t.is(pr.state, "MERGED");

  pr.state = "CLOSED";
  t.is(pr.state, "CLOSED");
  t.is(pr.source, b1);
  t.is(pr.destination, b2);
});

test("pullRequest modify invalid state", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr = new PullRequest(b1, b2, "4711");

  t.throws(() => {
    pr.state = "SOMETHING";
  });
});
