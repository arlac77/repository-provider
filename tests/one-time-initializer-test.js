import test from 'ava';
import { OneTimeInititalizerMixin } from '../src/one-time-initializer-mixin';

const MyProbe = OneTimeInititalizerMixin(
  class Base {
    constructor() {
      this.initializeCalled = 0;
    }

    async _initialize() {
      this.initializeCalled += 1;
    }
  }
);

test('call _initialize only once', async t => {
  const probe = new MyProbe();
  t.is(probe.initializeCalled, 0);
  await probe.initialize();
  t.is(probe.initializeCalled, 1);
  await probe.initialize();
  t.is(probe.initializeCalled, 1);
});
