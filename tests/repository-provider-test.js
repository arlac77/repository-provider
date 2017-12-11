import test from 'ava';
import { Provider, PullRequest } from '../src/repository-provider';

test('provider', async t => {
  const provider = new Provider({ key: 'value' });
  t.deepEqual(provider.config, { key: 'value' });
  t.is(provider.rateLimitReached, false);
});

test('repository ', async t => {
  const provider = new Provider();
  const repository = await provider.repository('r1');
  t.is(repository.name, 'r1');
});

test('pullRequests', async t => {
  const provider = new Provider();
  const repository = await provider.repository('r1');

  const prs = await repository.pullRequests;

  t.is(prs.length, 0);
});

test('create pullRequests', async t => {
  const repo = {};
  const pr = new PullRequest(repo, 'p1', { title: 'a title', state: 'closed' });

  t.is(pr.name, 'p1');
  t.is(pr.repository, repo);
  t.is(pr.title, 'a title');
  t.is(pr.state, 'closed');
});

test('create pullRequests without options', async t => {
  const repo = {};
  const pr = new PullRequest(repo, 'p1');

  t.is(pr.name, 'p1');
  t.is(pr.repository, repo);
});
