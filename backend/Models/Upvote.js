const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpvoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'IdeaPulseUsers',
    required: true
  },
  roadmapItem: {
    type: Schema.Types.ObjectId,
    ref: 'RoadmapItem',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UpvoteSchema.index({ user: 1, roadmapItem: 1 }, { unique: true });

const UpvoteModel = mongoose.model('Upvote', UpvoteSchema);

module.exports = UpvoteModel;