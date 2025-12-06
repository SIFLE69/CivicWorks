import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../lib/api';

type Notification = {
    _id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: {
        reportId?: string;
        badge?: string;
    };
};

export function NotificationBell({ onNotificationClick }: { onNotificationClick?: (reportId: string) => void }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications(1, 10, false);
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        setLoading(true);
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification._id);
        }
        if (notification.data?.reportId && onNotificationClick) {
            onNotificationClick(notification.data.reportId);
        }
        setIsOpen(false);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'status_update': return '📋';
            case 'comment': return '💬';
            case 'like': return '👍';
            case 'badge_earned': return '🏆';
            case 'escalation': return '🚨';
            case 'resolution': return '✅';
            case 'emergency_alert': return '⚠️';
            default: return '🔔';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button
                                className="mark-all-read"
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <span className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{formatTime(notification.createdAt)}</div>
                                    </div>
                                    {!notification.read && <span className="unread-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .notification-bell-container {
                    position: relative;
                }
                .notification-bell {
                    all: unset;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.2s;
                    color: var(--text-secondary);
                }
                .notification-bell:hover {
                    background: var(--hover-bg);
                    color: var(--text-primary);
                }
                .notification-badge {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: var(--danger);
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 700;
                    min-width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 4px;
                }
                .notification-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 8px;
                    width: 360px;
                    max-height: 480px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                    z-index: 1000;
                }
                @media (max-width: 640px) {
                    .notification-dropdown {
                        width: calc(100vw - 32px);
                        right: -60px;
                    }
                }
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid var(--border-color);
                }
                .notification-header h4 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                }
                .mark-all-read {
                    all: unset;
                    cursor: pointer;
                    font-size: 0.8125rem;
                    color: var(--brand-primary);
                    font-weight: 600;
                }
                .mark-all-read:hover {
                    text-decoration: underline;
                }
                .notification-list {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .notification-empty {
                    padding: 48px 24px;
                    text-align: center;
                    color: var(--text-muted);
                }
                .notification-item {
                    display: flex;
                    gap: 12px;
                    padding: 14px 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid var(--border-color);
                    position: relative;
                }
                .notification-item:last-child {
                    border-bottom: none;
                }
                .notification-item:hover {
                    background: var(--hover-bg);
                }
                .notification-item.unread {
                    background: rgba(17, 24, 39, 0.03);
                }
                [data-theme='dark'] .notification-item.unread {
                    background: rgba(255, 255, 255, 0.03);
                }
                .notification-icon {
                    font-size: 1.25rem;
                    flex-shrink: 0;
                }
                .notification-content {
                    flex: 1;
                    min-width: 0;
                }
                .notification-title {
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: 2px;
                    color: var(--text-primary);
                }
                .notification-message {
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .notification-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 4px;
                }
                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--brand-primary);
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-top: 6px;
                }
            `}</style>
        </div>
    );
}
