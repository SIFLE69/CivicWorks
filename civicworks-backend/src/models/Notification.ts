import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: [
            'status_update',      // Report status changed
            'comment',            // Someone commented on your report
            'like',               // Someone liked your report
            'badge_earned',       // You earned a new badge
            'escalation',         // Your report was escalated
            'resolution',         // Your report was resolved
            'emergency_alert',    // Emergency in your area
            'system'              // System notification
        ],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
        reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
        commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
        badge: String,
        link: String
    },
    read: { type: Boolean, default: false },
    readAt: Date,
}, { timestamps: true });

// Index for faster queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
