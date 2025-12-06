import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import {
    createReport,
    getReports,
    escalateReport,
    deEscalateReport,
    updateReportStatus,
    getReportStats,
    incrementViewCount
} from '../controllers/reportController';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Cloudinary storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'civicworks-reports',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    } as any,
});

const upload = multer({ storage });

// Main routes
router.route('/').get(getReports).post(protect, upload.single('photo'), createReport);

// Stats route
router.get('/stats', getReportStats);

// View count route (optional auth - tracks unique views for logged-in users)
router.post('/:id/view', optionalAuth, incrementViewCount);

// Escalation routes
router.post('/:id/escalate', protect, escalateReport);
router.post('/:id/de-escalate', protect, deEscalateReport);

// Status update route (for admins or report owners)
router.patch('/:id/status', protect, updateReportStatus);

export default router;

