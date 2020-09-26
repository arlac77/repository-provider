import test from "ava";
import { Review } from "repository-provider";

test("init review", async t => {
  const r = new Review();
  t.truthy(r);
});