import test from 'ava';
import { Provider } from '../src/repository-provider';
import { Branch } from '../src/branch';

test('branch ', async t => {
  const provider = new Provider();
  const repository = await provider.repository('r1');

  const b = new Branch(repository, 'b1');

  t.is(b.name, 'b1');
  t.is(await repository.branch('b1'), b);
});
