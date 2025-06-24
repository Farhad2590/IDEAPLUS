import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Heart, MessageCircle, Filter } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Loader from "../../components/shared/Loader";
import Error from "../../components/shared/Error";

const RoadmapApp = () => {
  const { userData } = useAuth();
  const { get, post } = useApi();
  const navigate = useNavigate();

  const [roadmapItems, setRoadmapItems] = useState([]);
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [filter, setFilter] = useState("all");

  const isLoggedIn = Boolean(userData?._id);

  useEffect(() => {
    fetchRoadmapData();
    if (isLoggedIn) fetchUserUpvotes();
  }, [userData]);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      const response = await get("/roadmap");
      setRoadmapItems(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch roadmap data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUpvotes = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await get(`/upvote/user/${userData._id}`);
      setUserUpvotes(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching user upvotes:", err);
    }
  };

  const handleUpvote = async (itemId) => {
    if (!isLoggedIn) {
      alert("Please sign in to upvote!");
      return;
    }

    try {
      const response = await post(`/upvote/${itemId}`);
      setRoadmapItems((items) =>
        items.map((item) =>
          item._id === itemId
            ? {
                ...item,
                upvotes: response.data.upvoted
                  ? (item.upvotes || 0) + 1
                  : (item.upvotes || 0) - 1,
              }
            : item
        )
      );

      setUserUpvotes((prev) =>
        response.data.upvoted
          ? [...prev, { roadmapItem: { _id: itemId } }]
          : prev.filter((upvote) => upvote.roadmapItem._id !== itemId)
      );
    } catch (err) {
      console.error("Error updating upvote:", err);
    }
  };

  const isItemUpvoted = (itemId) => {
    return (
      isLoggedIn &&
      userUpvotes.some((upvote) => upvote.roadmapItem._id === itemId)
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      In_Progress: "bg-blue-50 text-blue-700 border-blue-200",
      Planning: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Completed: "bg-green-50 text-green-700 border-green-200",
    };
    return colors[status] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Product Roadmap
          </h1>
          <p className="text-slate-600">
            Track our progress and upcoming features
          </p>
        </div>

        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p>Sign in to participate in discussions and upvote features!</p>
          </div>
        )}

        <div className="grid gap-6">
          {roadmapItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/roadmap/${item._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 mb-4">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={16} />
                      <span>{item.commentCount || 0} comments</span>
                    </div>
                  </div>
                </div>
                {/* Upvote button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpvote(item._id);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    isItemUpvoted(item._id)
                      ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={isItemUpvoted(item._id) ? "currentColor" : "none"}
                  />
                  <span className="font-semibold">{item.upvotes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No items found message */}
        {roadmapItems.length === 0 && (
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No items found
            </h3>
            <p className="text-slate-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapApp;
