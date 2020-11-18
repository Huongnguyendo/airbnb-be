const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Experience = require("./Experience");
const User = require("./User");

const reviewSchema = Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.ObjectId, required: true, ref: "User" },
    exp: { type: Schema.ObjectId, required: true, ref: "Exprience" },
    rating: {type: Number}
  },
  { timestamps: true }
);

reviewSchema.statics.calculateReviews = async function (expId) {
    const reviewCount = await this.find({ exp: expId }).countDocuments();
    await Experience.findByIdAndUpdate(expId, { reviewCount: reviewCount });
  };
  
reviewSchema.post("save", async function () {
    await this.constructor.calculateReviews(this.exp);
});

// Neither findByIdAndUpdate norfindByIdAndDelete have access to document middleware.
// They only get access to query middleware
// Inside this hook, this will point to the current query, not the current review.
// Therefore, to access the review, we’ll need to execute the query
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.doc = await this.findOne();
    next();
});
  
reviewSchema.post(/^findOneAnd/, async function (next) {
    await this.doc.constructor.calculateReviews(this.doc.exp);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;