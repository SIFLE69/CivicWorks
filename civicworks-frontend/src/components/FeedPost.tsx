import React, { useState } from 'react';
import { toggleLike, toggleDislike, reportFalse, addComment, getComments, deleteComment } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Report = {
    id: string;
    _id: string;
    category: string;
    description?: string;
    lat: number;
    lng: number;
    status: string;
    created_at: string;
    createdAt: string;
    photos?: string[];
    user?: { name: string; _id: string };
    likes?: string[];
    dislikes?: string[];
    falseReports?: string[];
};

type Comment = {
    _id: string;
    text: string;
    user: { name: string; _id: string };
    createdAt: string;
};

export function FeedPost({ report, onViewOnMap, onUpdate }: {
    report: Report;
    onViewOnMap: (lat: number, lng: number) => void;
    onUpdate: () => void;
}) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const reportId = report._id || report.id;
    const userLiked = report.likes?.includes(user?._id || '');
    const userDisliked = report.dislikes?.includes(user?._id || '');
    const userReported = report.falseReports?.includes(user?._id || '');

    const handleLike = async () => {
        try {
            await toggleLike(reportId);
            onUpdate();
        } catch (error) {
            console.error('Failed to like:', error);
        }
    };

    const handleDislike = async () => {
        try {
            await toggleDislike(reportId);
            onUpdate();
        } catch (error) {
            console.error('Failed to dislike:', error);
        }
    };

    const handleReportFalse = async () => {
        try {
            await reportFalse(reportId);
            onUpdate();
        } catch (error) {
            console.error('Failed to report:', error);
        }
    };

    const loadComments = async () => {
        if (showComments) {
            setShowComments(false);
            return;
        }
        setLoadingComments(true);
        try {
            const data = await getComments(reportId);
            setComments(data);
            setShowComments(true);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await addComment(reportId, commentText);
            setCommentText('');
            await loadComments();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) return;

        try {
            await deleteComment(commentId);
            await loadComments();
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment');
        }
    };

    return (
        <article className="feed-post">
            {/* Post Header */}
            <div className="post-header">
                <div className="post-avatar">{report.user?.name?.[0]?.toUpperCase() || '?'}</div>
                <div>
                    <div className="post-author">{report.user?.name || 'Anonymous'}</div>
                    <div className="post-time">{new Date(report.created_at || report.createdAt).toLocaleString()}</div>
                </div>
                <div className="post-category">{report.category}</div>
            </div>

            {/* Post Content */}
            {report.description && (
                <div className="post-content">
                    <p>{report.description}</p>
                </div>
            )}

            {/* Post Photo */}
            {report.photos?.[0] && (
                <div
                    className="post-image-container"
                    onClick={() => onViewOnMap(report.lat, report.lng)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                    title="Click to view on map"
                >
                    <img
                        src={report.photos[0]}
                        alt="Report evidence"
                        className="post-image"
                    />
                    <div className="map-overlay">
                        <span>📍 View on Map</span>
                    </div>
                </div>
            )}

            {/* Engagement Bar */}
            <div className="engagement-bar">
                <button
                    className={`engagement-btn ${userLiked ? 'active' : ''}`}
                    onClick={handleLike}
                >
                    👍 {report.likes?.length || 0}
                </button>
                <button
                    className={`engagement-btn ${userDisliked ? 'active' : ''}`}
                    onClick={handleDislike}
                >
                    👎 {report.dislikes?.length || 0}
                </button>
                <button
                    className="engagement-btn"
                    onClick={loadComments}
                >
                    💬 {comments.length} Comments
                </button>
                <button
                    className={`engagement-btn report-btn ${userReported ? 'active' : ''}`}
                    onClick={handleReportFalse}
                >
                    🚩 {report.falseReports?.length || 0}
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <div className="helper">No comments yet. Be the first to comment!</div>
                        ) : (
                            comments.map(c => (
                                <div key={c._id} className="comment">
                                    <div className="comment-avatar">{c.user.name[0].toUpperCase()}</div>
                                    <div className="comment-content">
                                        <div className="comment-author">{c.user.name}</div>
                                        <div className="comment-text">{c.text}</div>
                                        <div className="comment-time">{new Date(c.createdAt).toLocaleString()}</div>
                                    </div>
                                    {c.user._id === user?._id && (
                                        <button
                                            className="comment-delete-btn"
                                            onClick={() => handleDeleteComment(c._id)}
                                            title="Delete comment"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleAddComment} className="comment-form">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="comment-input"
                        />
                        <button type="submit" className="comment-submit">Post</button>
                    </form>
                </div>
            )}

            {/* Post Footer */}
            <div className="post-footer">
                <div className="post-location">
                    📍 {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
                </div>
                <button
                    className="view-map-btn"
                    onClick={() => onViewOnMap(report.lat, report.lng)}
                >
                    View on Map
                </button>
            </div>
        </article>
    );
}
