import { Request, Response } from 'express';
import Report from '../models/Report';
import User from '../models/User';
import { createNotification } from './notificationController';
import { checkAndAwardBadges, awardPoints } from '../services/badgeService';

interface AuthRequest extends Request {
    user?: any;
}

// Create a new report
export const createReport = async (req: AuthRequest, res: Response) => {
    try {
        const { category, description, lat, lng, isEmergency, priority } = req.body;
        const fileUrl = req.file ? (req.file as any).path : undefined;

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
            isEmergency: isEmergency === 'true' || isEmergency === true,
            priority: priority || (isEmergency ? 'critical' : 'medium'),
            statusHistory: [{
                status: 'pending',
                changedBy: req.user._id,
                note: 'Report created'
            }]
        });

        // Update user stats and check badges
        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                totalReports: 1,
                emergencyReports: isEmergency ? 1 : 0,
                points: isEmergency ? 20 : 10 // More points for emergency reports
            }
        });

        // Check and award badges
        await checkAndAwardBadges(req.user._id);

        res.status(201).json(report);
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get reports with search and filters
export const getReports = async (req: Request, res: Response) => {
    try {
        const {
            search,
            category,
            status,
            priority,
            isEmergency,
            lat,
            lng,
            radius, // in km
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 50
        } = req.query;

        const query: any = {};

        // Text search - use regex for partial matching (doesn't require text index)
        if (search && search !== '') {
            query.$or = [
                { description: { $regex: search as string, $options: 'i' } },
                { category: { $regex: search as string, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Priority filter
        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        // Emergency filter
        if (isEmergency === 'true') {
            query.isEmergency = true;
        }

        // Location-based filter (within radius)
        if (lat && lng && radius) {
            const radiusInDegrees = Number(radius) / 111; // rough conversion km to degrees
            query.lat = { $gte: Number(lat) - radiusInDegrees, $lte: Number(lat) + radiusInDegrees };
            query.lng = { $gte: Number(lng) - radiusInDegrees, $lte: Number(lng) + radiusInDegrees };
        }

        // Sorting
        const sortOptions: any = {};
        sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        const reports = await Report.find(query)
            .populate('user', 'name badges')
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        const total = await Report.countDocuments(query);

        res.json({
            reports,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            filters: { category, status, priority, isEmergency }
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Escalate report (mark as emergency)
export const escalateReport = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Calculate escalation level based on time since creation
        const daysSinceCreation = (Date.now() - new Date(report.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        let escalationLevel = 0;
        if (daysSinceCreation > 14) escalationLevel = 2;
        else if (daysSinceCreation > 7) escalationLevel = 1;

        report.isEmergency = true;
        report.priority = 'critical';
        report.escalatedAt = new Date();
        report.escalationLevel = escalationLevel;
        report.escalationReason = reason || 'Escalated by user';
        report.statusHistory.push({
            status: report.status,
            changedBy: req.user._id,
            note: `Escalated: ${reason || 'User requested escalation'}`
        });

        await report.save();

        // Notify report owner
        await createNotification(
            report.user.toString(),
            'escalation',
            '🚨 Report Escalated',
            `Your report has been escalated to priority status. Reason: ${reason || 'Critical issue identified'}`,
            { reportId: report._id }
        );

        res.json(report);
    } catch (error) {
        console.error('Escalate report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// De-escalate report (remove emergency status)
export const deEscalateReport = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.isEmergency = false;
        report.priority = 'medium'; // Reset to medium priority
        report.escalationLevel = 0;
        report.escalationReason = undefined;
        report.statusHistory.push({
            status: report.status,
            changedBy: req.user._id,
            note: `De-escalated: ${reason || 'Emergency status removed'}`
        });

        await report.save();

        // Notify report owner
        await createNotification(
            report.user.toString(),
            'status_update',
            '✅ Report De-escalated',
            `Your report emergency status has been removed. ${reason || 'Priority has been normalized.'}`,
            { reportId: report._id }
        );

        res.json(report);
    } catch (error) {
        console.error('De-escalate report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update report status (admin only)
export const updateReportStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, note, afterPhotos } = req.body;

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const oldStatus = report.status;
        report.status = status;
        report.statusHistory.push({
            status,
            changedBy: req.user._id,
            note: note || `Status changed from ${oldStatus} to ${status}`
        });

        if (status === 'resolved') {
            report.resolvedAt = new Date();
            if (afterPhotos && afterPhotos.length > 0) {
                report.afterPhotos = afterPhotos;
            }
        }

        await report.save();

        // Notify report owner
        await createNotification(
            report.user.toString(),
            'status_update',
            `📋 Status Updated: ${status.replace('_', ' ').toUpperCase()}`,
            `Your report status has been updated to "${status.replace('_', ' ')}". ${note || ''}`,
            { reportId: report._id }
        );

        res.json(report);
    } catch (error) {
        console.error('Update report status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get report statistics for map clustering
export const getReportStats = async (req: Request, res: Response) => {
    try {
        const stats = await Report.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                    },
                    emergency: {
                        $sum: { $cond: ['$isEmergency', 1, 0] }
                    }
                }
            }
        ]);

        const statusStats = await Report.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Report.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            byCategory: stats,
            byStatus: statusStats,
            byPriority: priorityStats,
            total: await Report.countDocuments()
        });
    } catch (error) {
        console.error('Get report stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Increment view count (unique per user)
export const incrementViewCount = async (req: AuthRequest, res: Response) => {
    try {
        const reportId = req.params.id;
        const userId = req.user?._id;

        // Find the report
        const report = await Report.findById(reportId);
        if (!report) {
            res.status(404).json({ message: 'Report not found' });
            return;
        }

        // Check if user already viewed (if logged in)
        if (userId) {
            const alreadyViewed = report.viewedBy?.some(
                (id: any) => id.toString() === userId.toString()
            );

            if (!alreadyViewed) {
                // Add user to viewedBy and increment count
                await Report.findByIdAndUpdate(reportId, {
                    $addToSet: { viewedBy: userId },
                    $inc: { viewCount: 1 }
                });

                res.json({
                    viewCount: report.viewCount + 1,
                    isNewView: true
                });
                return;
            }
        } else {
            // For non-logged-in users, just increment (can't track uniqueness)
            await Report.findByIdAndUpdate(reportId, {
                $inc: { viewCount: 1 }
            });

            res.json({
                viewCount: report.viewCount + 1,
                isNewView: true
            });
            return;
        }

        // Already viewed - return current count without incrementing
        res.json({
            viewCount: report.viewCount,
            isNewView: false
        });
    } catch (error) {
        console.error('Increment view count error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
