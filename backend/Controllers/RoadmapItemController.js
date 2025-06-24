const RoadmapItemModel = require("../Models/RoadmapItem");
const UpvoteModel = require("../Models/Upvote");

const getAllRoadmapItems = async (req, res) => {
  try {
    const items = await RoadmapItemModel.find()
      .populate("createdBy", "name email username photo")
      .sort({ createdAt: -1 });

    const itemsWithCounts = await Promise.all(
      items.map(async (item) => {
        const upvoteCount = await UpvoteModel.countDocuments({
          roadmapItem: item._id,
        });
        return {
          ...item.toObject(),
          upvoteCount,
        };
      })
    );

    res.status(200).json({
      message: "Roadmap items retrieved successfully",
      success: true,
      data: itemsWithCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getRoadmapItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await RoadmapItemModel.findById(id).populate(
      "createdBy",
      "name email username photo"
    );

    if (!item) {
      return res.status(404).json({
        message: "Roadmap item not found",
        success: false,
      });
    }

    const upvoteCount = await UpvoteModel.countDocuments({ roadmapItem: id });
    const responseItem = {
      ...item.toObject(),
      upvoteCount,
    };

    res.status(200).json({
      message: "Roadmap item retrieved successfully",
      success: true,
      data: responseItem,
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
  getAllRoadmapItems,
  getRoadmapItem
};