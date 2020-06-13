export function notImplementedError() {
  return new Error("not implemented");
}

export function asArray(value) {
  return Array.isArray(value) ? value : [value];
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

  const name = pattern.replace(/\*/, n);
  return name;
}

