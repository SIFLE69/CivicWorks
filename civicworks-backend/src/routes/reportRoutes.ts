import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { createReport, getReports } from '../controllers/reportController';
import { protect } from '../middleware/auth';

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

router.route('/').get(getReports).post(protect, upload.single('photo'), createReport);

export default router;
