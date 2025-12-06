import { Request, Response } from 'express';
import Report from '../models/Report';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

// Get user's own reports
export const getMyReports = async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    const reports = await Report.find({ user: userId })
        .populate('user', 'name badges')
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

// Update user language
export const updateLanguage = async (req: AuthRequest, res: Response) => {
    try {
        const { language } = req.body;
        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(
            userId,
            { language },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Update language error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update notification settings
export const updateNotificationSettings = async (req: AuthRequest, res: Response) => {
    try {
        const { statusUpdates, comments, likes, emailNotifications } = req.body;
        const userId = req.user._id;

        const updateData: any = {};
        if (statusUpdates !== undefined) updateData['notificationSettings.statusUpdates'] = statusUpdates;
        if (comments !== undefined) updateData['notificationSettings.comments'] = comments;
        if (likes !== undefined) updateData['notificationSettings.likes'] = likes;
        if (emailNotifications !== undefined) updateData['notificationSettings.emailNotifications'] = emailNotifications;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Update notification settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user badges
export const getUserBadges = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.params.userId || req.user._id;

        const user = await User.findById(userId)
            .select('badges points totalReports totalLikesReceived');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            badges: user.badges || [],
            points: user.points || 0,
            stats: {
                totalReports: user.totalReports || 0,
                totalLikesReceived: user.totalLikesReceived || 0,
            }
        });
    } catch (error) {
        console.error('Get user badges error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
