import test from "ava";
import { Provider } from "../src/provider";
import { PullRequest } from "../src/pull-request";

test("pullRequest list", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  const prs = await repository.pullRequests;

  t.is(prs.length, 0);
});

test("pullRequest create", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const pr = new PullRequest(repository, "p1", {
    title: "a title",
    body: "the body",
    state: "closed",
    id: "123456"
  });

  t.is(pr.name, "p1");
  t.is(pr.repository, repository);
  t.is(pr.provider, provider);
  t.is(pr.title, "a title");
  t.is(pr.body, "the body");
  t.is(pr.state, "closed");
  t.is(pr.locked, false);
  t.is(pr.merged, false);
  t.is(pr.id, "123456");
  t.is(pr.toString(), "p1: a title, state: closed, merged: false");

  t.is(await repository.pullRequest("p1"), pr);
});

test("pullRequest create without options", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const pr = new PullRequest(repository, "p1");

  t.is(pr.name, "p1");
  t.is(pr.locked, false);
  t.is(pr.merged, false);
  //t.is(pr.toString(), "p1: merged: false");

  t.is(pr.repository, repository);
});

test("pullRequest modify", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const pr = new PullRequest(repository, "p1");
  pr.merged = true;
  t.is(pr.merged, true);
  pr.state = "closed";
  t.is(pr.state, "closed");
});
