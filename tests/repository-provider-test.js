import test from 'ava';
import { Provider } from '../src/repository-provider';

test('provider', async t => {
  const provider = new Provider({ key: 'value' });
  t.deepEqual(provider.config, { key: 'value' });
  t.is(provider.rateLimitReached, false);
  t.is(provider.type, 'git');
  t.is(provider.name, 'Provider');
});

test('provider repository group', async t => {
  const provider = new Provider();
  t.is(await provider.repositoryGroup('p1'), undefined);
  const p1 = await provider.createRepositoryGroup('p1');
  t.is(p1.name, 'p1');
  t.is(await provider.repositoryGroup('p1'), p1);
});

test('provider repository group create repository', async t => {
  const provider = new Provider();
  t.is(await provider.repositoryGroup('p1'), undefined);
  const p1 = await provider.createRepositoryGroup('p1');
  const r1 = await p1.createRepository('r1');

  t.is(r1.name, 'r1');
  t.is(await p1.repository('r1'), r1);
  //t.is(await provider.repository('p1/r1'), r1);
});

test('get repository#branch', async t => {
  const provider = new Provider();
  const r = await provider.createRepository('r1');
  const b = await r.createBranch('b1');

  const branch = await provider.branch('r1#b1');
  t.is(branch.name, 'b1');
  t.is(branch.repository, r);
  t.is(branch.provider, provider);
});

test('get repository + default branch', async t => {
  const provider = new Provider();
  const r = await provider.createRepository('r1');
  const b = await r.createBranch('master');

  const branch = await provider.branch('r1');
  t.is(branch.name, 'master');
  t.is(branch.repository, r);
  t.is(branch.provider, provider);
});

test('get unknown repository + branch', async t => {
  const provider = new Provider();
  const r = await provider.createRepository('r1');
  const b = await r.createBranch('master');

  try {
    const branch = await provider.branch('r2#master');
  } catch (err) {
    t.is(err.message, 'Unknown repository r2');
  }

  try {
    const branch = await provider.branch('r2');
  } catch (err) {
    t.is(err.message, 'Unknown repository r2');
  }
});
