
/**
 * Match entries against pattern
 * @param {Iterator<string>} entries
 * @param {string[]} patterns
 * @param {any} getName
 * @param {boolean} caseSensitive
 * @return {Iterator<string>} filtered entries
 */
export function* match(entries, patterns, getName = entry=>entry, caseSensitive = true) {
    if (patterns === undefined) {
      yield* entries;
      return;
    }
  
    const rs = (Array.isArray(patterns) ? patterns : [patterns]).map(
      pattern =>
        new RegExp(
          "^" + pattern
          .replace(/(\*\*\/|\*)/g, ".*")
         // .replace(/\*\*\//g, ".*")
         // .replace(/\*/g, ".*")
          .replace(/\!(.*)/,(m,r) => `((?!${r}).)*`)
          + "$",
          caseSensitive ? undefined : "i"
        )
    );
  
    //console.log(rs);
  
    for (const entry of entries) {
      for (const r of rs) {
        if (getName(entry).match(r)) {
          yield entry;
          break;
        }
      }
    }
  }