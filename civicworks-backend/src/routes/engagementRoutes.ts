import express from 'express';
import { protect } from '../middleware/auth';
import {
    toggleLike,
    toggleDislike,
    reportFalse,
    addComment,
    getComments,
    deleteComment
} from '../controllers/engagementController';

const router = express.Router();

// Engagement routes
router.post('/reports/:id/like', protect, toggleLike);
router.post('/reports/:id/dislike', protect, toggleDislike);
router.post('/reports/:id/report-false', protect, reportFalse);
router.post('/reports/:id/comments', protect, addComment);
router.get('/reports/:id/comments', getComments);
router.delete('/comments/:id', protect, deleteComment);

export default router;
