import { Request, Response } from 'express';
import Report from '../models/Report';
import Comment from '../models/Comment';

interface AuthRequest extends Request {
    user?: any;
}

// Toggle like on a report
export const toggleLike = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findById(id);
    if (!report) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }

    const likeIndex = report.likes.indexOf(userId);
    const dislikeIndex = report.dislikes.indexOf(userId);

    // Remove from dislikes if present
    if (dislikeIndex > -1) {
        report.dislikes.splice(dislikeIndex, 1);
    }

    // Toggle like
    if (likeIndex > -1) {
        report.likes.splice(likeIndex, 1);
    } else {
        report.likes.push(userId);
    }

    await report.save();
    res.json({ likes: report.likes.length, dislikes: report.dislikes.length });
};

// Toggle dislike on a report
export const toggleDislike = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findById(id);
    if (!report) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }

    const likeIndex = report.likes.indexOf(userId);
    const dislikeIndex = report.dislikes.indexOf(userId);

    // Remove from likes if present
    if (likeIndex > -1) {
        report.likes.splice(likeIndex, 1);
    }

    // Toggle dislike
    if (dislikeIndex > -1) {
        report.dislikes.splice(dislikeIndex, 1);
    } else {
        report.dislikes.push(userId);
    }

    await report.save();
    res.json({ likes: report.likes.length, dislikes: report.dislikes.length });
};

// Report as false
export const reportFalse = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findById(id);
    if (!report) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }

    const falseReportIndex = report.falseReports.indexOf(userId);

    // Toggle false report
    if (falseReportIndex > -1) {
        report.falseReports.splice(falseReportIndex, 1);
    } else {
        report.falseReports.push(userId);
    }

    await report.save();
    res.json({ falseReports: report.falseReports.length });
};

// Add comment to a report
export const addComment = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
        res.status(400).json({ message: 'Comment text is required' });
        return;
    }

    const report = await Report.findById(id);
    if (!report) {
        res.status(404).json({ message: 'Report not found' });
        return;
    }

    const comment = await Comment.create({
        report: id,
        user: userId,
        text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name');
    res.status(201).json(populatedComment);
};

// Get comments for a report
export const getComments = async (req: Request, res: Response) => {
    const { id } = req.params;

    const comments = await Comment.find({ report: id })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    res.json(comments);
};

// Delete a comment (own only)
export const deleteComment = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
    }

    if (comment.user.toString() !== userId.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this comment' });
        return;
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted' });
};
