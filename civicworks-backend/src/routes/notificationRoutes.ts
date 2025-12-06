import express from 'express';
import { protect } from '../middleware/auth';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../controllers/notificationController';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user's notifications
router.get('/', getNotifications);

// Mark single notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

export default router;
