const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  roadmapItem: {
    type: Schema.Types.ObjectId,
    ref: 'RoadmapItem',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'IdeaPulseUsers',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  depth: {
    type: Number,
    required: true,
    default: 0,
    max: 2 
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

CommentSchema.statics.updateRoadmapItemCommentCount = async function(roadmapItemId) {
  const count = await this.countDocuments({ 
    roadmapItem: roadmapItemId, 
    isDeleted: false 
  });
  
  await mongoose.model('RoadmapItem').findByIdAndUpdate(
    roadmapItemId, 
    { commentCount: count }
  );
};

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;