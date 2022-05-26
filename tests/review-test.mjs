import test from "ava";
import { Review } from "repository-provider";

test("Review type", t => t.is(Review.type, "review"));
test("Review collection name", t => t.is(Review.collectionName, "reviews"));

test("init Review", t => {
  let theReview;

  const owner = {
    name: "o1",
    _addReview: review => {
      theReview = review;
    }
  };

  const r = new Review(owner);
  t.truthy(r);
  t.is(r, theReview);
});
