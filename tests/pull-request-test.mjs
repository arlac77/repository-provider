import test from "ava";
import { Provider } from "../src/provider.mjs";
import { PullRequest } from "../src/pull-request.mjs";

test("pullRequest list", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  const prs = await repository.pullRequests;

  t.is(prs.length, 0);
});

test("pullRequest create", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr = new PullRequest(b1, b2, "p1", {
    title: "a title",
    body: "the body",
    state: "closed",
    id: "123456"
  });

  t.is(pr.name, "p1");
  t.is(pr.source, b1);
  t.is(pr.destination, b2);
  t.is(pr.provider, provider);
  t.is(pr.title, "a title");
  t.is(pr.body, "the body");
  t.is(pr.state, "closed");
  t.is(pr.locked, false);
  t.is(pr.merged, false);
  t.is(pr.id, "123456");
  t.is(
    `${pr}`,
    "p1: a title, state: closed, locked: false, merged: false, destination: r1#b2"
  );

  t.is(await repository.pullRequest("p1"), pr);

  const prs = {};
  for await (const pr of repository.pullRequests()) {
    prs[pr.name] = pr;
  }

  t.is(prs[pr.name], pr);
});

test("pullRequest create without options", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b1 = await repository.createBranch("b1");
  const b2 = await repository.createBranch("b2");

  const pr = new PullRequest(b1, b2, "p1");

  t.is(pr.name, "p1");
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

  const pr = new PullRequest(b1, b2, "p1");

  pr.merged = true;
  t.is(pr.merged, true);
  t.is(pr.state, "merged");

  pr.state = "closed";
  t.is(pr.state, "closed");
  t.is(pr.source, b1);
  t.is(pr.destination, b2);
});
