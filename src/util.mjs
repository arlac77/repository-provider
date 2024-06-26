import { Repository } from "./repository.mjs";

/**
 * Convert scalar into an array.
 * The value undefined will be represented as an empty array.
 * @param {Array|any} value
 * @return {Array} value encapsulated in an array
 */
export function asArray(value) {
  return Array.isArray(value) ? value : value === undefined ? [] : [value];
}

/**
 * Strip repository base name away.
 * A URL auth component will be removed to.
 * @param {string|undefined} name
 * @param {string[]} repositoryBases all possible bases
 * @param {function(string):void} [whenFound] to be called with the found base name
 * @return {string|undefined} name without base
 */
export function stripBaseName(name, repositoryBases, whenFound) {
  if (name) {
    for (const b of repositoryBases) {
      const m = name.match(/^(\w+:)\/\/([^@]+@)/);
      if (m) {
        name = m[1] + "//" + name.substring(m[1].length + 2 + m[2].length);
      }

      if (name.startsWith(b)) {
        whenFound?.(b);
        return name.slice(b.length);
      }
    }
  }
  return name;
}

/**
 * Loops over names and executes stripBaseName.
 * @param {string[]|string|undefined} names
 * @param {string[]} repositoryBases all possible bases
 * @param {function(string):void} [whenFound] to be called with the found base name
 * @return {string[]|string|undefined} names without base
 */
export function stripBaseNames(names, repositoryBases, whenFound) {
  return Array.isArray(names)
    ? names.map(name => stripBaseName(name, repositoryBases, whenFound))
    : stripBaseName(names, repositoryBases, whenFound);
}

/**
 * Find a new branch name for a given pattern.
 * '*' will be replaced by a number.
 * 'something/*' will get to something/1 something/2 ...
 * @param {Repository} repository
 * @param {string} pattern
 * @return {Promise<string>}
 */
export async function generateBranchName(repository, pattern) {
  let n = 1;

  for await (const b /* UNUSED_DECL*/ of repository.branches(pattern)) {
    n++;
  }

  return pattern.replace(/\*+/, n.toString());
}
