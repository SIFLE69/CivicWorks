import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Get user's notifications
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const query: any = { user: userId };
        if (unreadOnly === 'true') {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('data.reportId', 'category description')
            .lean();

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ user: userId, read: false });

        res.json({
            notifications,
            total,
            unreadCount,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { read: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark all as read
export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        await Notification.updateMany(
            { user: userId, read: false },
            { read: true, readAt: new Date() }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to create notification (used by other controllers)
export const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
) => {
    try {
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            data
        });
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        return null;
    }
};
