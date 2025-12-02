import { Request, Response } from 'express';
import Report from '../models/Report';

interface AuthRequest extends Request {
    user?: any;
}

// Get user's own reports
export const getMyReports = async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    const reports = await Report.find({ user: userId })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    res.json(reports);
};

// Delete own report
export const deleteReport = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findById(id);
    if (!report) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }

    if (report.user.toString() !== userId.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this report' });
        return;
    }

    await Report.findByIdAndDelete(id);
    res.json({ message: 'Report deleted successfully' });
};
