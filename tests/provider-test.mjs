import test from "ava";
import { providerTest } from "repository-provider-test-support";
import { SingleGroupProvider, MultiGroupProvider } from "repository-provider";

test(providerTest, new SingleGroupProvider());
test(providerTest, new MultiGroupProvider());

test("messageDestination default", t => {
  const sp = new SingleGroupProvider();
  t.is(sp.messageDestination, console);

  const myMessageDestination = {};
  sp.messageDestination = myMessageDestination;
  t.is(sp.messageDestination, myMessageDestination);
});

test("messageDestination", t => {
  let info;
  const sp = new SingleGroupProvider({
    messageDestination: { info: (...args) => (info = [...args]) }
  });

  sp.info("info");

  t.deepEqual(info, ["info"]);

  const myMessageDestination = {};
  sp.messageDestination = myMessageDestination;
  t.is(sp.messageDestination, myMessageDestination);
});
