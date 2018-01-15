import test from 'ava';
import { Provider } from '../src/repository-provider';
import { Branch } from '../src/branch';

test('branch', async t => {
  const provider = new Provider();
  const repository = await provider.createRepository('r1');

  const b = new Branch(repository, 'b1');

  t.is(b.repository, repository);
  t.is(b.provider, provider);
  t.is(b.name, 'b1');
  t.is(b.fullName, 'r1#b1');
  t.is(await repository.branch('b1'), b);
});

test('branch delete', async t => {
  const provider = new Provider();
  const repository = await provider.createRepository('r1');

  const b = new Branch(repository, 'b1');
  await b.delete();

  t.is(await repository.branch('b1'), undefined);
});
