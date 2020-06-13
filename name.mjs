function t(name) {
  const object = { };
  let right = false;
  const res = name.replace(/((\.git)?(#(.*))?)$/, (match, a, b, c, branch) => {
    if (branch) {
      object.branch = branch;
    }
    right = a.length > 0;

    return "";
  });

  return [name, res, right, object];
}

console.log(t("a.git"));
console.log(t("a.git#b"));
console.log(t("a#b"));
console.log(t("a"));
