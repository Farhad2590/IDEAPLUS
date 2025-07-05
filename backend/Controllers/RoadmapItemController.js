const RoadmapItemModel = require("../Models/RoadmapItem");
const UpvoteModel = require("../Models/Upvote");

const getAllRoadmapItems = async (req, res) => {
  try {
    const { status, category, sort } = req.query;

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    let sortOption = { createdAt: -1 }; 
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "most_upvotes") {
      sortOption = { upvotes: -1 };
    } else if (sort === "least_upvotes") {
      sortOption = { upvotes: 1 }; 
    }

    const items = await RoadmapItemModel.find(filter)
      .populate("createdBy", "name email username photo")
      .sort(sortOption)
      .lean(); 

    const itemsWithCounts = items.map((item) => ({
      ...item,
      upvoteCount: item.upvotes || 0, 
    }));

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

    const responseItem = {
      ...item.toObject(),
      upvoteCount: item.upvotes || 0, 
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
  getRoadmapItem,
};