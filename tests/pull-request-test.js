import test from 'ava';
import { Provider } from '../src/repository-provider';
import { PullRequest } from '../src/pull-request';

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
