/**
 * Match entries against glob pattern
 * @param {Iterator<string>} entries
 * @param {string[]} patterns
 * @param {Object} options
 * @param {Function} options.getName
 * @param {boolean} options.caseSensitive
 * @return {Iterator<string>} filtered entries
 */
export function* match(entries, patterns, options = { caseSensitive: true }) {
  if (
    patterns === undefined ||
    (Array.isArray(patterns) && patterns.length === 0)
  ) {
    yield* entries;
    return;
  }

  const regex = compile(
    Array.isArray(patterns) ? patterns : [patterns],
    options
  );

  if (options.getName) {
    const getName = options.getName;
    for (const entry of entries) {
      if (getName(entry).match(regex)) {
        yield entry;
      }
    }
  } else {
    for (const entry of entries) {
      //console.log("M",entry,entry.match(regex),options);
      if (entry.match(regex)) {
        yield entry;
      }
    }
  }
}

function compileSimple(input) {
  let output = "";

  for (let i = 0; i < input.length; i++) {
    const s = input[i];
    switch (s) {
      case ".":
        output += "\\.";
        break;
      case "*":
        if (input[i + 1] === "*") {
          output += ".*";
          i++;
          if (input[i + 1] === "/") {
            i++;
          }
        } else {
          output += ".*";
        }
        break;
      case "/":
        output += "\\/";
        break;
      default:
        output += s;
    }
  }
  return output;
}

export function compile(patterns, options) {
  const parts = [];

  for (const pattern of patterns) {
    if (pattern[0] === "!") {
      parts.push("((?!" + compileSimple(pattern.substring(1)) + ").)*");
    } else {
      parts.push(
        parts.length ? "|" + compileSimple(pattern) : compileSimple(pattern)
      );
    }
  }

  const source = "^" + parts.join("") + "$";

  //console.log("P", patterns, source, options.caseSensitive);
  return new RegExp(source, options.caseSensitive ? undefined : "i");
}
