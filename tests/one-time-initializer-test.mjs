import test from 'ava';
import { OneTimeInititalizerMixin } from '../src/one-time-initializer-mixin.mjs';

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
  t.is(probe.isInitialized, false);
  await probe.initialize();
  t.is(probe.initializeCalled, 1);
  t.is(probe.isInitialized, true);
  await probe.initialize();
  t.is(probe.initializeCalled, 1);
});
