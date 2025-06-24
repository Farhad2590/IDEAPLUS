const UpvoteModel = require("../Models/Upvote");
const RoadmapItemModel = require("../Models/RoadmapItem");
const mongoose = require("mongoose");

const upvoteItem = async (req, res) => {
  try {
    const { roadmapItemId } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(roadmapItemId)) {
      return res.status(400).json({
        message: "Invalid roadmap item ID",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        success: false,
      });
    }

    console.log("User ID:", userId);
    console.log("Roadmap Item ID:", roadmapItemId);

    const roadmapItem = await RoadmapItemModel.findById(roadmapItemId);
    console.log("Roadmap item found:", roadmapItem);

    if (!roadmapItem) {
      return res.status(404).json({
        message: "Roadmap item not found",
        success: false,
      });
    }

    const existingUpvote = await UpvoteModel.findOne({
      user: userId,
      roadmapItem: roadmapItemId,
    });

    if (existingUpvote) {
      await UpvoteModel.findByIdAndDelete(existingUpvote._id);
      await RoadmapItemModel.findByIdAndUpdate(roadmapItemId, {
        $inc: { upvotes: -1 },
      });

      return res.status(200).json({
        message: "Upvote removed successfully",
        success: true,
        upvoted: false,
      });
    }

    const newUpvote = new UpvoteModel({
      user: userId,
      roadmapItem: roadmapItemId,
    });

    await newUpvote.save();
    await RoadmapItemModel.findByIdAndUpdate(roadmapItemId, {
      $inc: { upvotes: 1 },
    });
    
    const updatedItem = await RoadmapItemModel.findById(roadmapItemId);
    console.log("Updated roadmap item:", updatedItem);

    res.status(201).json({
      message: "Item upvoted successfully",
      success: true,
      upvoted: true,
    });
  } catch (err) {
    console.error("Upvote error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getUserUpvotes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false,
      });
    }

    console.log("Fetching upvotes for user:", userId);

    const upvotes = await UpvoteModel.find({ user: userId })
      .populate("roadmapItem", "title category status")
      .select("roadmapItem createdAt");

    console.log("Found upvotes:", upvotes);

    res.status(200).json({
      message: "User upvotes retrieved successfully",
      success: true,
      data: upvotes,
    });
  } catch (err) {
    console.error("Get user upvotes error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getUpvoteCount = async (req, res) => {
  try {
    const { roadmapItemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roadmapItemId)) {
      return res.status(400).json({
        message: "Invalid roadmap item ID",
        success: false,
      });
    }

    const count = await UpvoteModel.countDocuments({
      roadmapItem: roadmapItemId,
    });

    res.status(200).json({
      message: "Upvote count retrieved successfully",
      success: true,
      count,
    });
  } catch (err) {
    console.error("Get upvote count error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  upvoteItem,
  getUserUpvotes,
  getUpvoteCount,
};