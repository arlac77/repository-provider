import test from "ava";
import {
  RepositoryGroup,
  definePropertiesFromOptions,
  optionJSON
} from "repository-provider";

function dpot(t, object, options, expected) {
  definePropertiesFromOptions(object, options);
  expected(t, object);
}

dpot.title = (providedTitle = "", a, b) =>
  `definePropertiesFromOptions ${providedTitle} ${JSON.stringify(
    a
  )} ${b}`.trim();

test(dpot, {}, { name: "a" }, (t, object) => t.is(object.a, undefined));

function ojt(t, object, initial, skip, result) {
  t.deepEqual(optionJSON(object, initial, skip), result);
}

ojt.title = (providedTitle = "", a, b) =>
  `optionJSON ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(ojt, {}, undefined, undefined, {});
test(ojt, new RepositoryGroup(undefined, "a", { id: 1 }), undefined, [], {
  id: 1
});
