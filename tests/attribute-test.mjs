import test from "ava";
import {
  getAttribute,
  setAttribute,
  RepositoryGroup,
  BaseObject,
  definePropertiesFromOptions,
  optionJSON
} from "repository-provider";

function gat(t, object, key, expected) {
  const value = getAttribute(object, key);
  t.is(value, expected);
}

gat.title = (providedTitle, object, key) =>
  `getAttribute ${providedTitle ? providedTitle + " " : ""}${key}`.trim();

test(gat, { a: 1 }, "a", 1);
test(gat, { a: { b: 1 } }, "a.b", 1);
test(gat, {}, "x.y.z", undefined);

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
    return {
      att1: {},
      att2: { type: "boolean" },
      att3: { set: x => x * 2 },
      "authentification.token": {},
      "authentification.user": { default: "hugo"},
      "a.b.c.d": { default: 7 }
    };
  }
}

test(dpot, new MyClass(), { att2: 0 }, (t, object) => t.is(object.att2, false));
test(dpot, new MyClass(), { att2: false }, (t, object) =>
  t.is(object.att2, false)
);
test(dpot, new MyClass(), { att2: "0" }, (t, object) =>
  t.is(object.att2, false)
);
test(dpot, new MyClass(), { att2: "1" }, (t, object) =>
  t.is(object.att2, true)
);
test(dpot, new MyClass(), { att2: true }, (t, object) =>
  t.is(object.att2, true)
);
test(dpot, new MyClass(), { att2: 7 }, (t, object) => t.is(object.att2, true));
test(dpot, new MyClass(), { att3: 7 }, (t, object) => t.is(object.att3, 14));

test(dpot, { b: 7 }, undefined, (t, object) => t.is(object.b, 7));
test(dpot, {}, {}, (t, object) => t.is(object.a, undefined));
test(dpot, {}, { name: "a" }, (t, object) => t.is(object.a, undefined));
test(
  dpot,
  new MyClass(),
  { "authentification.token": "abc", "authentification.user": "emil" },
  (t, object) => {
    t.is(object.authentification.token, "abc");
    t.is(object.authentification.user, "emil");
  }
);

test(dpot, new MyClass(), { something: "a" }, (t, object) => {
  t.is(object.authentification.token, undefined);
  t.is(object.authentification.user, "hugo");
});

test(dpot, new MyClass(), { something: "b" }, (t, object) =>
  t.is(object.a.b.c.d, 7)
);

function ojt(t, object, initial, skip, result) {
  t.deepEqual(optionJSON(object, initial, skip), result);
}

ojt.title = (providedTitle, a, b) =>
  `optionJSON ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    a
  )} ${b}`.trim();

test(ojt, {}, undefined, undefined, {});
test(ojt, new RepositoryGroup(undefined, "a", { id: 1 }), undefined, [], {
  id: 1,
  isAdmin: false
});

test("writeable attribute", t => {
  let object = new BaseObject();

  object.description = "d1";

  t.is(object.description, "d1");

  object = new BaseObject({ description: "x" });
  t.is(object.description, "x");

  object.description = "d1";

  t.is(object.description, "d1");
});

function sat(t, object, key, value, expected) {
  setAttribute(object, key, value);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, key, value) =>
  `setAttribute ${
    providedTitle ? providedTitle + " " : ""
  }${key}=${value}`.trim();

test(sat, {}, "a", 1, { a: 1 });
test(sat, {}, "a.b", 1, { a: { b: 1 } });
test(sat, { a: { x: 7 } }, "a.b.c.d", 1, { a: { x: 7, b: { c: { d: 1 } } } });
