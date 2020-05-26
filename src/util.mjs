export function notImplementedError() {
  return new Error("not implemented");
}

export function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * Create properties from options and default options
 * Already present properties (direct) are skipped
 * @see Object.definedProperties()
 * @see Object.hasOwnProperty()
 * @param {Object} object target object
 * @param {Object} options as passed to object constructor
 * @param {Object} properties object properties
 */
export function definePropertiesFromOptions(object, options, properties = {}) {
  const defaultOptions = object.constructor.defaultOptions;
  const after = {};

  if (defaultOptions !== undefined) {
    Object.entries(defaultOptions).forEach(([name, defaultOption]) => {
      if (object.hasOwnProperty(name)) {
        return;
      }

      const value = (options !== undefined && options[name]) || defaultOption;

      if (value !== undefined) {
        if (properties[name] === undefined) {
          properties[name] = { value };
        } else {
          after[name] = value;
        }
      }
    });
  }

  Object.defineProperties(object, properties);
  Object.assign(object, after);
}

/**
 * create json based on present options.
 * In other words only produce key value pairs if value is defined.
 * @param {Object} object
 * @param {Object} initial
 * @param {string[]} skip keys not to put in the result
 * @return {Object} initial + defined values
 */
export function optionJSON(object, initial = {}, skip = []) {
  return Object.keys(object.constructor.defaultOptions || {})
    .filter(key => skip.indexOf(key) < 0)
    .reduce((a, c) => {
      const value = object[c];
      if (value !== undefined && !(value instanceof Function)) {
        a[c] = value;
      }
      return a;
    }, initial);
}

/**
 * find a new branch name for a given pattern
 * '*' will be replaced by a number
 * 'something/*' will get to something/1 something/2 ...
 * @param {Repository} repository
 * @param {string} pattern
 */
export async function generateBranchName(repository, pattern) {
  let n = 1;

  //const present = new Set();

  for await (const b of repository.branches(pattern)) {
    //console.log("FOUND", b.name);
    //present.add(b.name);
    n++;
  }

  const name = pattern.replace(/\*/, n);
  return name;
}

/**
 * Rename attributes
 * @param {Object} object
 * @param {Object} mapping
 * @return {Object} keys renamed after mapping
 */
export function mapAttributes(object, mapping) {
  return Object.fromEntries(
    Object.entries(object).map(([name, value]) => [
      mapping[name] ? mapping[name] : name,
      value
    ])
  );
}

/**
 * Match entries against pattern
 * @param {*<string>} entries
 * @param {string[]} patterns
 * @param {boolean} caseSensitive
 * @return {string *} filtered entries
 */
export function* match(entries, patterns, caseSensitive = true) {
  if (patterns === undefined) {
    yield* entries;
    return;
  }

  const rs = (Array.isArray(patterns) ? patterns : [patterns]).map(
    pattern =>
      new RegExp(
        "^" + pattern.replace(/\*/g, ".*") + "$",
        caseSensitive ? undefined : "i"
      )
  );

  for (const entry of entries) {
    for (const r of rs) {
      if (entry.match(r)) {
        yield entry;
        break;
      }
    }
  }
}
