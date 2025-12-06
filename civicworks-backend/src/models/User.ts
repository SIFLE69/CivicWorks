import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    language: string;
    badges: string[];
    points: number;
    notificationSettings: {
        statusUpdates: boolean;
        comments: boolean;
        likes: boolean;
        emailNotifications: boolean;
    };
    totalReports: number;
    totalLikesReceived: number;
    totalCommentsReceived: number;
    emergencyReports: number;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Multi-language support
    language: { type: String, default: 'en', enum: ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn'] },
    // Badge System
    badges: [{
        type: String,
        enum: [
            'first_report',      // First complaint submitted
            'top_contributor',   // 10+ complaints
            'neighborhood_hero', // 50+ complaints
            'quick_responder',   // Fast response time
            'verified_citizen',  // Email verified
            'helpful',           // 50+ likes received
            'accurate',          // High accuracy rate
            'eagle_eye',         // 5+ false report catches
            'community_star',    // 100+ total engagement
            'emergency_reporter' // 5+ emergency reports
        ]
    }],
    points: { type: Number, default: 0 },
    // Notification Settings
    notificationSettings: {
        statusUpdates: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        likes: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: false }
    },
    // Stats for badge calculation
    totalReports: { type: Number, default: 0 },
    totalLikesReceived: { type: Number, default: 0 },
    totalCommentsReceived: { type: Number, default: 0 },
    emergencyReports: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;

