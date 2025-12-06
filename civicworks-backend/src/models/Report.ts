import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
});

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    description: String,
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    photos: [String],
    afterPhotos: [String], // Photos after resolution
    status: {
        type: String,
        enum: ['pending', 'under_review', 'in_progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    statusHistory: [statusHistorySchema],
    // Emergency Escalation
    isEmergency: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    escalatedAt: Date,
    escalationLevel: { type: Number, default: 0 }, // 0 = normal, 1 = escalated, 2 = high escalation
    escalationReason: String,
    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    falseReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // View Tracking
    viewCount: { type: Number, default: 0 },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Unique views per user
    resolvedAt: Date,
    estimatedResolutionDays: Number,
}, { timestamps: true });

// Index for search and filtering
reportSchema.index({ category: 1, status: 1, isEmergency: 1, priority: 1 });
reportSchema.index({ lat: 1, lng: 1 });
reportSchema.index({ description: 'text' });

export default mongoose.model('Report', reportSchema);
