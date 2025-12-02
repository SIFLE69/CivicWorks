import express from 'express';
import { protect } from '../middleware/auth';
import { getMyReports, deleteReport } from '../controllers/profileController';

const router = express.Router();

router.get('/my-reports', protect, getMyReports);
router.delete('/reports/:id', protect, deleteReport);

export default router;
