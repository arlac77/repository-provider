import test from "ava";
import {
  defaultValues,
  getAttribute,
  setAttribute,
  RepositoryGroup,
  definePropertiesFromOptions,
  optionJSON,
  MultiGroupProvider
} from "repository-provider";

function gat(t, object, key, expected) {
  const value = getAttribute(object, key);
  t.is(value, expected);
}

gat.title = (providedTitle, object, key) =>
  `getAttribute ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${key}`.trim();

test(gat, undefined, "a", undefined);
test(gat, { a: 1 }, "a", 1);
test(gat, { a: { b: 1 } }, "a.b", 1);
test(gat, { "a.b" : 1 }, "a.b", 1);
test(gat, {}, "x.y.z", undefined);

function dpot(t, object, options, expected) {
  definePropertiesFromOptions(object, options);
  expected(t, object);
}

dpot.title = (providedTitle, object, options) =>
  `definePropertiesFromOptions ${
    providedTitle ? providedTitle + " " : ""
  }${JSON.stringify(object)} ${JSON.stringify(options)}`.trim();

test(dpot, { b: 7 }, undefined, (t, object) => t.is(object.b, 7));
test(dpot, {}, {}, (t, object) => t.is(object.a, undefined));
test(dpot, {}, { name: "a" }, (t, object) => t.is(object.a, undefined));

function dpct(t, clazz, options, expected) {
  const object = new clazz(options);
  expected(t, object);
}

dpct.title = (providedTitle, clazz, options) =>
  `constructor options ${providedTitle ? providedTitle + " " : ""}${
    clazz.name
  } ${JSON.stringify(options)}`.trim();

class MyClass {
  static get attributes() {
    return {
      read_only: {},
      rw: { writable: true },
      att_setter: { set: x => x * 2 },
      boolean_conversion: { type: "boolean" },
      preexisting_property: {},
      "authentification.token": {},
      "authentification.user": { default: "hugo" },
      "a.b.c.d": { default: 7 },
      calculatedDefault: {
        get: (attribute, object) => object.preexisting_property + 1
      }
    };
  }

  constructor(options, additionalProperties) {
    definePropertiesFromOptions(this, options, additionalProperties);
  }

  get preexisting_property() {
    return 77;
  }
  set preexisting_property(value) {
    this._preexisting_property = value;
  }
}
test(dpct, MyClass, { other: 1 }, (t, o) => t.is(o.calculatedDefault, 77 + 1));
test(dpct, MyClass, { boolean_conversion: 0 }, (t, o) =>
  t.is(o.boolean_conversion, false)
);
test(dpct, MyClass, { boolean_conversion: false }, (t, o) =>
  t.is(o.boolean_conversion, false)
);
test(dpct, MyClass, { boolean_conversion: "0" }, (t, o) =>
  t.is(o.boolean_conversion, false)
);
test(dpct, MyClass, { boolean_conversion: "1" }, (t, o) =>
  t.is(o.boolean_conversion, true)
);
test(dpct, MyClass, { boolean_conversion: true }, (t, o) =>
  t.is(o.boolean_conversion, true)
);
test(dpct, MyClass, { boolean_conversion: 7 }, (t, o) =>
  t.is(o.boolean_conversion, true)
);
test(dpct, MyClass, { att_setter: 7 }, (t, o) => t.is(o.att_setter, 14));
test(dpct, MyClass, { read_only: 1 }, (t, o) => {
  t.is(o.read_only, 1);
  try {
    o.read_only = 2;
    t.fail();
  } catch (e) {
    t.true(true);
  }
});
test(dpct, MyClass, { rw: 1 }, (t, o) => {
  t.is(o.rw, 1);
  o.rw = 2;
  t.is(o.rw, 2);
});
test(dpct, MyClass, undefined, (t, o) => {
  o.rw = 2;
  t.is(o.rw, 2);
});

test(
  dpct,
  MyClass,
  { "authentification.token": "abc", "authentification.user": "emil" },
  (t, object) => {
    t.is(object.authentification.token, "abc");
    t.is(object.authentification.user, "emil");
  }
);

test(dpct, MyClass, { something: "a" }, (t, object) => {
  t.is(object.authentification.token, undefined);
  t.is(object.authentification.user, "hugo");
});

test("default with deep path", dpct, MyClass, { something: "b" }, (t, object) =>
  t.is(object.a.b.c.d, 7)
);

test(dpct, MyClass, { preexisting_property: 77 }, (t, object) => {
  t.is(object.preexisting_property, 77);
  t.is(object._preexisting_property, 77);
});

function ojt(t, object, initial, skip, result) {
  t.deepEqual(optionJSON(object, initial, skip), result);
}

ojt.title = (providedTitle, a, b) =>
  `optionJSON ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    a
  )} ${b}`.trim();

test(ojt, {}, undefined, undefined, {});
test(
  ojt,
  new RepositoryGroup(new MultiGroupProvider(), "a", { id: 1 }),
  undefined,
  undefined,
  {
    id: 1,
    isAdmin: false
  }
);

function sat(t, object, key, value, expected) {
  setAttribute(object, key, value);
  t.deepEqual(object, expected);
}

sat.title = (providedTitle, object, key, value, expected) =>
  `setAttribute ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    object
  )} ${key}=${value} => ${JSON.stringify(expected)}`.trim();

test(sat, {}, "a", 1, { a: 1 });
test(sat, {}, "a.b", 1, { a: { b: 1 } });
test(sat, { a: { b: "x" } }, "a.b", 1, { a: { b: 1 } });

test(sat, { a: 1 }, "a.b", 1, { a: { b: 1 } });
test(sat, { a: "1" }, "a.b", 1, { a: { b: 1 } });
test(sat, { a: { x: 7 } }, "a.b.c.d", 1, { a: { x: 7, b: { c: { d: 1 } } } });

test("default values", t => {
  t.deepEqual(
    { "a.b.c.d": 7, "authentification.user": "hugo", calculatedDefault: 3 },
    defaultValues(MyClass.attributes, { preexisting_property: 2 })
  );
});
