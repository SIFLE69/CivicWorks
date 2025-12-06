import React, { useState, useEffect } from 'react';
import { toggleLike, toggleDislike, reportFalse, addComment, getComments, deleteComment, incrementViewCount } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { EmergencyIndicator, EscalationButton } from './EmergencyEscalation';
import { BadgeRow } from './BadgeDisplay';

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
    user?: { name: string; _id: string; badges?: string[] };
    likes?: string[];
    dislikes?: string[];
    falseReports?: string[];
    isEmergency?: boolean;
    priority?: string;
    viewCount?: number;
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
    const [viewCount, setViewCount] = useState(report.viewCount || 0);

    const reportId = report._id || report.id;
    const userLiked = report.likes?.includes(user?._id || '');
    const userDisliked = report.dislikes?.includes(user?._id || '');
    const userReported = report.falseReports?.includes(user?._id || '');

    // Track view when post becomes visible (backend handles unique tracking)
    useEffect(() => {
        const trackView = async () => {
            try {
                const data = await incrementViewCount(reportId);
                setViewCount(data.viewCount);
            } catch (error) {
                // Silently fail - views are not critical
            }
        };
        trackView();
    }, [reportId]);

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
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div className="post-author">{report.user?.name || 'Anonymous'}</div>
                        {report.user?.badges && report.user?.badges.length > 0 && (
                            <BadgeRow badges={report.user.badges} maxDisplay={3} />
                        )}
                    </div>
                    <div className="post-time">
                        {new Date(report.created_at || report.createdAt).toLocaleString()}
                        <span style={{ marginLeft: '12px', color: 'var(--text-muted)' }}>
                            👁 {viewCount} views
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {report.isEmergency && <EmergencyIndicator isEmergency={report.isEmergency} priority={report.priority} />}
                    <div className="post-category">{report.category}</div>
                </div>
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
                    title="Like this report"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span>{report.likes?.length || 0}</span>
                </button>
                <button
                    className={`engagement-btn ${userDisliked ? 'active' : ''}`}
                    onClick={handleDislike}
                    title="Dislike this report"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                    <span>{report.dislikes?.length || 0}</span>
                </button>
                <button
                    className="engagement-btn"
                    onClick={loadComments}
                    title="View comments"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{comments.length}</span>
                </button>
                <button
                    className={`engagement-btn report-btn ${userReported ? 'active' : ''}`}
                    onClick={handleReportFalse}
                    title="Report as false"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" y1="22" x2="4" y2="15"></line>
                    </svg>
                    <span>{report.falseReports?.length || 0}</span>
                </button>

                {/* Escalation Button */}
                {!report.isEmergency && (
                    <EscalationButton
                        reportId={reportId}
                        isEmergency={report.isEmergency}
                        onEscalated={onUpdate}
                    />
                )}
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
