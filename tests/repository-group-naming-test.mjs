import test from "ava";
import { Provider } from "../src/provider.mjs";
import { RepositoryGroup } from "../src/group.mjs";
import { Repository } from "../src/repository.mjs";

function rgnt(t, gn, rn, options, fn) {
  const provider = new Provider();
  const group = new RepositoryGroup(provider, gn);
  const repository = new Repository(group, rn, options);
  t.is(repository.fullName, fn);
}

rgnt.title = (providedTitle = "", gn, rn, options, fn) =>
  `rgnt ${providedTitle} ${gn} ${rn} <> ${fn}`.trim();

test(rgnt, "g1", "r1", {}, "g1/r1");
test(rgnt, "g1", "r1#master", {}, "g1/r1");
test(rgnt, "g1", "g1/r1#master", {}, "g1/r1");
test(rgnt, "g1", "g1/r1", {}, "g1/r1");
test(rgnt, "g1", "something/g1/r1", {}, "g1/r1");
