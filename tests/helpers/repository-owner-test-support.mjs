function quote(names) {
  return names === undefined
    ? "undefined"
    : Array.isArray(names)
    ? "[" + names.map(n => "'" + n + "'").join(",") + "]"
    : "'" + names + "'";
}

export async function ownerTypeLookupTest(t, type, owner, name, expected) {
  const item = await owner[type](name);

  if (expected === undefined) {
    t.is(item, undefined);
  } else {
    t.truthy(item);
    t.is(item.fullName, expected);
  }
}

ownerTypeLookupTest.title = (
  providedTitle = `owner lookup`,
  type,
  owner,
  name,
  expected
) =>
  `${providedTitle} ${type} ${quote(name)} = ${quote(expected)}`.trim();

export async function ownerTypeListTest(t, type, owner, pattern, expected) {
  const items = {};

  for await (const item of owner[type](pattern)) {
    items[item.fullName] = item;
  }

  if (typeof expected === "number") {
    t.truthy(
      expected == Object.keys(items).length,
      `expected at least ${expected} but got ${
        Object.keys(items).length
      } entries for ${pattern}`
    );
    return;
  }

  if (expected === undefined) {
    t.is(Object.keys(items).length, 0);
  } else {
    t.true(Object.keys(items).length >= expected.length);

    for (const name of expected) {
      const item = items[name];

      t.truthy(
        item !== undefined,
        `missing expected ${type} ${name} in (${Object.keys(items)})`
      );
    }
  }
}

ownerTypeListTest.title = (
  providedTitle = `owner list`,
  type,
  owner,
  pattern,
  expected
) =>
  `${providedTitle} ${type} ${quote(pattern)} = ${
    typeof expected === "number"
      ? "#" + expected
      : expected
      ? "[" + expected + "]"
      : "not present"
  }`.trim();
