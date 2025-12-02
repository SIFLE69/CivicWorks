import express from 'express';
import multer from 'multer';
import path from 'path';
import { createReport, getReports } from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.route('/').get(getReports).post(protect, upload.single('photo'), createReport);

export default router;
