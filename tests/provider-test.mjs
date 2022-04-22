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

test("provider logging", async t => {
  const { messageDestination, messages, levels } = createMessageDestination();
  const provider = new SingleGroupProvider({ messageDestination });

  const repository = await provider.addRepository("r1");

  for (const l of levels) {
    repository[l](l);
    t.deepEqual(messages[l], [l], l);
  }

  const myMessageDestination = {};
  provider.messageDestination = myMessageDestination;
  t.is(provider.messageDestination, myMessageDestination);
});
