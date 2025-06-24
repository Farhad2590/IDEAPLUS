import React, { useState, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";
import CommentComponent from "./CommentComponent";
import useApi from "../hooks/useApi";

const CommentsSection = ({ roadmapItemId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const api = useApi();

  useEffect(() => {
    fetchComments();
  }, [roadmapItemId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/${roadmapItemId}`);

      if (response.data.success) {
        setComments(response.data.data);
        setCommentCount(countAllComments(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const countAllComments = (commentList) => {
    let count = 0;
    commentList.forEach((comment) => {
      count++;
      if (comment.replies && comment.replies.length > 0) {
        count += countAllComments(comment.replies);
      }
    });
    return count;
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await api.post(`/comments/${roadmapItemId}`, {
        content: newComment,
      });

      if (response.data.success) {
        setComments((prev) => [response.data.data, ...prev]);
        setNewComment("");
        setCommentCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      if (response.data.success) {
        setComments((prev) =>
          updateCommentInList(prev, commentId, response.data.data)
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.data.success) {
        const commentToDelete = findCommentInList(comments, commentId);
        const deletedCount = commentToDelete
          ? countAllComments([commentToDelete])
          : 1;

        setComments((prev) => removeCommentFromList(prev, commentId));
        setCommentCount((prev) => prev - deletedCount);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReplyToComment = async (content, parentCommentId) => {
    try {
      const response = await api.post(`/comments/${roadmapItemId}`, {
        content,
        parentCommentId,
      });

      if (response.data.success) {
        setComments((prev) =>
          addReplyToComment(prev, parentCommentId, response.data.data)
        );
        setCommentCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Helper functions for comment list manipulation
  const findCommentInList = (commentList, commentId) => {
    for (const comment of commentList) {
      if (comment._id === commentId) return comment;
      if (comment.replies?.length > 0) {
        const found = findCommentInList(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  };

  const updateCommentInList = (commentList, commentId, updatedComment) => {
    return commentList.map((comment) => {
      if (comment._id === commentId) {
        return { ...comment, ...updatedComment };
      }
      if (comment.replies?.length > 0) {
        return {
          ...comment,
          replies: updateCommentInList(
            comment.replies,
            commentId,
            updatedComment
          ),
        };
      }
      return comment;
    });
  };

  const removeCommentFromList = (commentList, commentId) => {
    return commentList.filter((comment) => {
      if (comment._id === commentId) return false;
      if (comment.replies?.length > 0) {
        comment.replies = removeCommentFromList(comment.replies, commentId);
      }
      return true;
    });
  };

  const addReplyToComment = (commentList, parentCommentId, newReply) => {
    return commentList.map((comment) => {
      if (comment._id === parentCommentId) {
        return {
          ...comment,
          replies: [newReply, ...(comment.replies || [])],
        };
      }
      if (comment.replies?.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(
            comment.replies,
            parentCommentId,
            newReply
          ),
        };
      }
      return comment;
    });
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">
            Sign in to comment
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            You need to be signed in to view and post comments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Comments ({commentCount})
          </h3>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-start space-x-3">
          <img
            src={currentUser?.photo}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              disabled={submitting}
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2 disabled:opacity-50"
              >
                <Send size={14} />
                <span>{submitting ? "Posting..." : "Post Comment"}</span>
              </button>
              <span className="text-xs text-slate-400">
                {newComment.length}/1000
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-slate-600">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No comments yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {comments.map((comment) => (
              <CommentComponent
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                onReply={handleReplyToComment}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
