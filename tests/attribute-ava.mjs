import test from "ava";
import {
  RepositoryGroup,
  definePropertiesFromOptions,
  optionJSON,
  MultiGroupProvider
} from "repository-provider";

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
  static attributes = {
    read_only: {},
    rw: { writable: true },
    att_setter: { set: x => x * 2 },
    boolean_conversion: { type: "boolean" },
    set_conversion: { type: "set" },
    preexisting_property: {},
    "authentification.token": {},
    "authentification.user": { default: "hugo" },
    "a.b.c.d": { default: 7 },
    calculatedDefault: {
      get: (attribute, object) => object.preexisting_property + 1
    }
  };

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

test(dpct, MyClass, { set_conversion: ["a", "b"] }, (t, o) =>
  t.deepEqual(o.set_conversion, new Set(["a", "b"]))
);
test(dpct, MyClass, { set_conversion: new Set(["a", "b"]) }, (t, o) =>
  t.deepEqual(o.set_conversion, new Set(["a", "b"]))
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

function ojt(t, object, initial, result) {
  t.deepEqual(optionJSON(object, initial), result);
}

ojt.title = (providedTitle, a, b) =>
  `optionJSON ${providedTitle ? providedTitle + " " : ""}${JSON.stringify(
    a
  )} ${b}`.trim();

test(ojt, {}, undefined, {});

test(
  ojt,
  new RepositoryGroup(new MultiGroupProvider(), "a", { id: 1 }),
  undefined,
  {
    id: 1,
    isAdmin: false,
    name: "a"
  }
);
