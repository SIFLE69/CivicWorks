import express from 'express';
import { protect } from '../middleware/auth';
import {
    getMyReports,
    deleteReport,
    updateLanguage,
    updateNotificationSettings,
    getUserBadges,
    getUserProfile
} from '../controllers/profileController';

const router = express.Router();

// Get user profile
router.get('/', protect, getUserProfile);

// Reports
router.get('/my-reports', protect, getMyReports);
router.delete('/reports/:id', protect, deleteReport);

// Settings
router.patch('/language', protect, updateLanguage);
router.patch('/notification-settings', protect, updateNotificationSettings);

// Badges
router.get('/badges', protect, getUserBadges);
router.get('/:userId/badges', protect, getUserBadges);

export default router;
