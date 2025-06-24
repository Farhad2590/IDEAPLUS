const CommentModel = require("../Models/Comment");
const RoadmapItemModel = require("../Models/RoadmapItem");

const populateComments = async (comments, depth = 0) => {
  if (depth >= 2) return comments; 

  await CommentModel.populate(comments, {
    path: "replies",
    match: { isDeleted: false },
    populate: {
      path: "user",
      select: "name email photo username",
    },
    options: { sort: { createdAt: 1 } }, 
  });

  for (const comment of comments) {
    if (comment.replies && comment.replies.length > 0) {
      await populateComments(comment.replies, depth + 1);
    }
  }

  return comments;
};

const addComment = async (req, res) => {
  try {
    const { roadmapItemId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user._id;

    const roadmapItem = await RoadmapItemModel.findById(roadmapItemId);
    if (!roadmapItem) {
      return res.status(404).json({
        message: "Roadmap item not found",
        success: false,
      });
    }

    let depth = 0;
    let parentComment = null;

    if (parentCommentId) {
      parentComment = await CommentModel.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          message: "Parent comment not found",
          success: false,
        });
      }

      depth = parentComment.depth + 1;
      if (depth > 2) {
        return res.status(400).json({
          message: "Maximum reply depth reached (3 levels)",
          success: false,
        });
      }
    }

    const newComment = new CommentModel({
      content,
      roadmapItem: roadmapItemId,
      user: userId,
      parentComment: parentCommentId || null,
      depth,
    });

    await newComment.save();

    if (parentComment) {
      parentComment.replies.push(newComment._id);
      await parentComment.save();
    }

    await CommentModel.updateRoadmapItemCommentCount(roadmapItemId);
    await newComment.populate("user", "name email photo username");

    res.status(201).json({
      message: "Comment added successfully",
      success: true,
      data: newComment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await CommentModel.findOne({
      _id: commentId,
      user: userId,
      isDeleted: false,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to edit it",
        success: false,
      });
    }

    comment.content = content;
    await comment.save();

    await comment.populate("user", "name email photo username");

    res.status(200).json({
      message: "Comment updated successfully",
      success: true,
      data: comment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await CommentModel.findOne({
      _id: commentId,
      user: userId,
      isDeleted: false,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to delete it",
        success: false,
      });
    }

    comment.isDeleted = true;
    await comment.save();

    await CommentModel.updateRoadmapItemCommentCount(comment.roadmapItem);

    res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { roadmapItemId } = req.params;

    const comments = await CommentModel.find({
      roadmapItem: roadmapItemId,
      parentComment: null,
      isDeleted: false,
    })
      .populate("user", "name email photo username")
      .sort({ createdAt: -1 });

    const populatedComments = await populateComments(comments);

    res.status(200).json({
      message: "Comments retrieved successfully",
      success: true,
      data: populatedComments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  addComment,
  editComment,
  deleteComment,
  getComments,
};
