import test from "ava";
import { Review } from "repository-provider";

test("Review type", t => t.is(Review.type, "review"));

test("init Review", t => {
  const r = new Review();
  t.truthy(r);
});