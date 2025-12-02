import { Request, Response } from 'express';
import Report from '../models/Report';

interface AuthRequest extends Request {
    user?: any;
}

export const createReport = async (req: AuthRequest, res: Response) => {
    const { category, description, lat, lng } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!category || !lat || !lng) {
        res.status(400).json({ message: 'Category, lat, and lng are required' });
        return;
    }

    const report = await Report.create({
        user: req.user._id,
        category,
        description,
        lat: Number(lat),
        lng: Number(lng),
        photos: fileUrl ? [fileUrl] : [],
    });

    res.status(201).json(report);
};

export const getReports = async (req: Request, res: Response) => {
    const reports = await Report.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(reports);
};
