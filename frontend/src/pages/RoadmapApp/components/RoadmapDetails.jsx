import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Loader from "../../../components/shared/Loader";
import Error from "../../../components/shared/Error";
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  Calendar,
  User,
  Tag,
  TrendingUp,
  XCircle,
} from "lucide-react";
import CommentComponent from "./CommentComponent";
import useAuth from "../../../hooks/useAuth";
import useApi from "../../../hooks/useApi";

const RoadmapDetails = () => {
  const { id: itemId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { get, post, put, delete: deleteRequest } = useApi();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (itemId) {
      fetchRoadmapItem();
    }
  }, [itemId]);

  const fetchRoadmapItem = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get roadmap item and comments
      const [itemResponse, commentsResponse] = await Promise.all([
        get(`/roadmap/${itemId}`),
        get(`/comments/${itemId}`),
      ]);

      setItem({
        ...itemResponse.data.data,
        comments: commentsResponse.data.data,
      });
    } catch (err) {
      console.error("Error fetching roadmap item:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch roadmap item"
      );
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content, parentId = null) => {
    if (!userData?._id) {
      alert("Please sign in to comment!");
      return;
    }
    if (!content.trim()) return;

    try {
      setSubmittingComment(true);
      await post(`/comments/${itemId}`, {
        content,
        parentCommentId: parentId,
      });

      setNewComment("");
      fetchRoadmapItem();
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpvote = async () => {
    if (!userData?._id) {
      toast.error("Please sign in to upvote!");
      return;
    }

    try {
      // Optimistic update
      setItem((prev) => ({
        ...prev,
        upvotes: prev.userUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
        userUpvoted: !prev.userUpvoted,
      }));

      await post(`/upvote/${itemId}`);
    } catch (err) {
      console.error("Error updating upvote:", err);
      fetchRoadmapItem();
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await deleteRequest(`/comments/${commentId}`);
      fetchRoadmapItem();
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const editComment = async (commentId, newContent) => {
    if (!newContent.trim()) return;

    try {
      await put(`/comments/${commentId}`, { content: newContent });
      fetchRoadmapItem();
    } catch (err) {
      console.error("Error editing comment:", err);
      toast.error("Failed to edit comment. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate("/roadmap");
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !item) {
    return <Error />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
              <button
                onClick={handleUpvote}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  item.userUpvoted
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Heart
                  size={18}
                  fill={item.userUpvoted ? "currentColor" : "none"}
                />
                <span className="font-semibold">{item.upvotes || 0}</span>
              </button>
            </div>

            {/* Status and Category Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {item.status}
              </span>

              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {item.category}
              </span>

              {item.priority && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">
                    Priority {item.priority}
                  </span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <User className="h-4 w-4" />
                <span>
                  Created by {item.createdBy?.name || item.author || "Unknown"}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(item.createdAt || item.date)}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4" />
                <span>{item.upvotes || item.upvoteCount || 0} upvotes</span>
              </div>
            </div>

            {item.targetRelease && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Tag className="h-4 w-4" />
                  <span>Target Release: {item.targetRelease}</span>
                </div>
              </div>
            )}

            {/* Comment Count */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MessageCircle className="h-4 w-4" />
                <span>
                  {item.commentCount || item.comments?.length || 0} comments
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle size={24} className="text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Comments ({item.commentCount || item.comments?.length || 0})
              </h2>
            </div>

            {userData ? (
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  {userData?.photo ? (
                    <img
                      src={userData?.photo}
                      alt={userData?.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-2">
                      Commenting as{" "}
                      <span className="font-medium text-slate-900">
                        {userData?.name}
                      </span>
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts or suggestions..."
                      className="w-full p-4 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      disabled={submittingComment}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => addComment(newComment)}
                    disabled={submittingComment || !newComment.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    <span>
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                <p>
                  Please sign in to post comments and participate in
                  discussions!
                </p>
              </div>
            )}

            <div className="space-y-6">
              {item.comments?.map((comment) => (
                <CommentComponent
                  key={comment._id}
                  comment={comment}
                  itemId={item._id}
                  currentUser={userData}
                  onDelete={deleteComment}
                  onEdit={editComment}
                  onReply={addComment}
                />
              ))}
              {(!item.comments || item.comments.length === 0) && (
                <div className="text-center py-12 text-slate-500">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 text-slate-300"
                  />
                  <p className="text-lg">No comments yet</p>
                  <p className="text-sm">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetails;
