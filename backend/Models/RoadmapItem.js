// Models/RoadmapItem.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoadmapItemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  category: {
    type: String,
    required: true,
    enum: ["feature", "enhancement", "bugfix", "other"],
  },
  status: {
    type: String,
    required: true,
    enum: ["under_review", "planned", "in_progress", "completed", "rejected"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "IdeaPulseUsers",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  targetRelease: {
    type: String,
    trim: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

RoadmapItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const RoadmapItemModel = mongoose.model("RoadmapItem", RoadmapItemSchema);

module.exports = RoadmapItemModel;
