import test from "ava";
import { providerTest, createMessageDestination } from "repository-provider-test-support";
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
  const { messageDestination, messages } = createMessageDestination();

  const sp = new SingleGroupProvider({
    messageDestination
  });

  sp.info("info");
  sp.error("error");
  sp.warn("warn");

  t.deepEqual(messages.info, ["info"]);
  t.deepEqual(messages.error, ["error"]);
  t.deepEqual(messages.warn, ["warn"]);

  const myMessageDestination = {};
  sp.messageDestination = myMessageDestination;
  t.is(sp.messageDestination, myMessageDestination);
});
