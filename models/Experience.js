const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ExperienceSchema = Schema({
    title: {type: String},
    pictureUrl: {type: String},
    country: {type: String},
    city: {type: String},
    groupsize: {type: Number},
    description: {type: String},
    category: {type: [String]},
    language: {type: [String], enum: ["English", "Vietnamese"]},
    minimumRate: {type: Number},
    duration: {type: Number},
    reviewCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
    averageRating: {
      type: Number,
      // default: 0,
      min: 0,
      max: 5,
    },
    tag: {
      type: String,
      // required: true,
      enum: [
        "Animals",
        "Arts & Writing",
        "Cooking",
        "Dance",
        "Drinks",
        "Entertainment",
        "Fitness",
        "History & Culture",
        "Magic",
        "Music",
        "Wellness"
      ],
    },
    author: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "User",
    },
})

ExperienceSchema.plugin(require("./plugins/isDeletedFalse"));

const Experience = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
module.exports = Experience;