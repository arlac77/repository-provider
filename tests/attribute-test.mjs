import test from "ava";
import { SingleGroupProvider, RepositoryGroup, Branch,
  definePropertiesFromOptions,
  optionJSON
} from "repository-provider";

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
