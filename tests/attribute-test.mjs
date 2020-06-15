import test from "ava";
import {
  getAttribute,
  RepositoryGroup,
  definePropertiesFromOptions,
  optionJSON
} from "repository-provider";

function gat(t, object, key, expected) {
  const value = getAttribute(object, key);
  t.is(value, expected);
}

gat.title = (providedTitle, object, key) =>
  `getAttribute ${
    providedTitle ? providedTitle + " " : ""
  }${key}`.trim();

test(gat, { a:1 }, 'a', 1);
test(gat, { a: {b: 1} }, 'a.b', 1);

function dpot(t, object, options, expected) {
  definePropertiesFromOptions(object, options);
  expected(t, object);
}

dpot.title = (providedTitle, a, b) =>
  `definePropertiesFromOptions ${
    providedTitle ? providedTitle + " " : ""
  }${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

class MyClass {
  static get attributes() {
    att1 : {}
  }
}

test(dpot, { b:7 }, undefined, (t, object) => t.is(object.b, 7));
test(dpot, {}, {}, (t, object) => t.is(object.a, undefined));
test(dpot, {}, { name: "a" }, (t, object) => t.is(object.a, undefined));
//test(dpot, new MyClass(), { att1: 77 }, (t, object) => t.is(object.att1, 77));

function ojt(t, object, initial, skip, result) {
  t.deepEqual(optionJSON(object, initial, skip), result);
}

ojt.title = (providedTitle, a, b) =>
  `optionJSON ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    a
  )} ${b}`.trim();

test(ojt, {}, undefined, undefined, {});
test(ojt, new RepositoryGroup(undefined, "a", { id: 1 }), undefined, [], {
  id: 1
});
