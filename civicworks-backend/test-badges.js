// Quick script to award test badges to your user
// Run this in MongoDB or via node

const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    badges: [String],
    points: Number,
    totalReports: Number
});

const User = mongoose.model('User', userSchema);

async function awardTestBadges() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find your user (update email to match yours)
        const user = await User.findOne({}).sort({ createdAt: -1 });

        if (!user) {
            console.log('No user found');
            return;
        }

        // Award some test badges
        user.badges = ['first_report', 'top_contributor', 'helpful'];
        user.points = 150;
        await user.save();

        console.log(`✅ Awarded badges to ${user.name}:`, user.badges);
        console.log(`✅ Points: ${user.points}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

awardTestBadges();
