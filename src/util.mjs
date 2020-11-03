/**
 * Convert scalar into an array.
 * The value undefined will be represented as an empty array. 
 * @param {any|Array} value
 * @return {Array} value encapsulated in an array 
 */
export function asArray(value) {
  return Array.isArray(value) ? value : value === undefined ? [] : [value];
}

/**
 * Strip repository base name away.
 * @param {string} name
 * @param {string[]} repositoryBases all possible bases
 * @param {Function} whenFound to be called with the found base name
 * @return {string} name without base
 */
export function stripBaseName(name, repositoryBases, whenFound) {
  for (const b of repositoryBases) {
    if (name.startsWith(b)) {
      if (whenFound) {
        whenFound(b);
      }
      return name.slice(b.length);
    }
  }
  return name;
}

/**
 * Find a new branch name for a given pattern
 * '*' will be replaced by a number
 * 'something/*' will get to something/1 something/2 ...
 * @param {Repository} repository
 * @param {string} pattern
 */
export async function generateBranchName(repository, pattern) {
  let n = 1;

  //const present = new Set();

  for await (const b of repository.branches(pattern)) {
    n++;
  }

  return pattern.replace(/\*/, n);
}
