import test from "ava";
import { SingleGroupProvider, RepositoryGroup, Branch,
  generateBranchName,
  definePropertiesFromOptions,
  optionJSON
} from "repository-provider";

async function gbnt(t, branchNames, pattern, result) {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");

  for (const bn of branchNames) {
    new Branch(repository, bn);
  }

  t.is(await generateBranchName(repository, pattern), result);
}

gbnt.title = (providedTitle = "", a, b) =>
  `generateBranchName ${providedTitle} ${a} ${b}`.trim();

test(gbnt, ["b1"], "x1", "x1");
test(gbnt, ["b1"], "b*", "b2");
test(gbnt, ["b1", "b2"], "b*", "b3");
test(gbnt, ["b1", "b2", "b3"], "b*", "b4");
test(gbnt, ["b1", "mkpr/1"], "mkpr/*", "mkpr/2");

test("props", t => {
  const object = {};

  definePropertiesFromOptions(object, { name: "a" });
  t.is(object.a, undefined);
});

function ojt(t, object, initial, skip, result) {
  t.deepEqual(optionJSON(object, initial, skip), result);
}

ojt.title = (providedTitle = "", a, b) =>
  `optionJSON ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(ojt, {}, undefined, undefined, {});
test(
  ojt,
  new RepositoryGroup(undefined, "a", { id: 1 }),
  undefined,
  [],
  { id: 1 }
);
