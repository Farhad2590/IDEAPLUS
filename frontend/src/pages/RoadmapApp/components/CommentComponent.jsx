import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Send,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CommentComponent = ({
  comment,
  itemId,
  currentUser,
  onDelete,
  onEdit,
  onReply,
  depth = 0,
}) => {
  const [editContent, setEditContent] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const maxDepth = 3;
  const canEdit = currentUser && currentUser._id === comment.user._id;
  const canReply = depth < maxDepth && currentUser;
  const hasReplies = comment.replies && comment.replies.length > 0;



  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      setSubmittingEdit(true);
      await onEdit(comment._id, editContent);
      setIsEditing(false);
    } catch (err) {
      console.error("Error editing comment:", err);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      setSubmittingReply(true);
      await onReply(replyContent, comment._id);
      setReplyContent("");
      setShowReply(false);
    } catch (err) {
      console.error("Error replying to comment:", err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  // Calculate margin based on depth for better visual hierarchy
  const getMarginClass = () => {
    if (depth === 0) return "mt-4";
    if (depth === 1) return "ml-6 mt-3";
    if (depth === 2) return "ml-8 mt-3";
    return "ml-10 mt-3";
  };

  // Calculate border style based on depth
  const getBorderClass = () => {
    if (depth === 0) return "border-l-2 border-slate-200";
    if (depth === 1) return "border-l-2 border-blue-200";
    if (depth === 2) return "border-l-2 border-green-200";
    return "border-l-2 border-purple-200";
  };

  return (
    <div className={`${getMarginClass()} ${getBorderClass()} pl-4`}>
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <img
              src={comment.user?.photo}
              alt={comment.user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900">
                  {comment.user?.name}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(comment.createdAt)}
                </span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-slate-500 italic">
                    (edited)
                  </span>
                )}
                {depth > 0 && (
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Reply
                  </span>
                )}
              </div>
              {comment.user?.email && (
                <span className="text-xs text-slate-400">
                  {comment.user.email}
                </span>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded"
                title="Edit comment"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                title="Delete comment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={submittingEdit}
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  disabled={submittingEdit || !editContent.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingEdit ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
              <span className="text-xs text-slate-400">
                {editContent.length}/1000
              </span>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-700 mb-3 whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center space-x-4">
              {canReply && (
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  {showReply ? "Cancel Reply" : "Reply"}
                </button>
              )}

              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center text-slate-500 hover:text-slate-700 text-sm"
                >
                  {showReplies ? (
                    <>
                      <ChevronUp size={14} className="mr-1" />
                      Hide replies
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} className="mr-1" />
                      {comment.replies.length}{" "}
                      {comment.replies.length === 1 ? "reply" : "replies"}
                    </>
                  )}
                </button>
              )}

              {/* Show depth indicator for debugging purposes (remove in production) */}
              {depth > 0 && (
                <span className="text-xs text-slate-400">Depth: {depth}</span>
              )}
            </div>
          </>
        )}

        {showReply && (
          <div className="mt-4 bg-slate-50 rounded-lg p-3">
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={currentUser?.photo}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover"
              />

              <div className="flex-1">
                <span className="text-sm font-medium text-slate-700">
                  {currentUser?.name}
                </span>
                <div className="text-xs text-slate-500 mt-1">
                  Replying to {currentUser?.name}
                </div>
              </div>
            </div>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${currentUser?.name || "user"}...`}
              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={submittingReply}
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReply}
                  disabled={submittingReply || !replyContent.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  <span>{submittingReply ? "Posting..." : "Reply"}</span>
                </button>
                <button
                  onClick={() => {
                    setShowReply(false);
                    setReplyContent("");
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
              <span className="text-xs text-slate-400">
                {replyContent.length}/1000
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply._id}
              comment={reply}
              itemId={itemId}
              currentUser={currentUser}
              onDelete={onDelete}
              onEdit={onEdit}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
