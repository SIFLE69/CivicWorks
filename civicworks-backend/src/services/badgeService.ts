import User from '../models/User';
import { createNotification } from '../controllers/notificationController';

// Badge definitions with criteria
const BADGE_CRITERIA = {
    first_report: {
        name: 'First Report',
        description: 'Submitted your first complaint',
        icon: '🎯',
        check: (stats: any) => stats.totalReports >= 1
    },
    top_contributor: {
        name: 'Top Contributor',
        description: 'Submitted 10+ complaints',
        icon: '⭐',
        check: (stats: any) => stats.totalReports >= 10
    },
    neighborhood_hero: {
        name: 'Neighborhood Hero',
        description: 'Submitted 50+ complaints',
        icon: '🦸',
        check: (stats: any) => stats.totalReports >= 50
    },
    helpful: {
        name: 'Helpful',
        description: 'Received 50+ likes on your reports',
        icon: '👍',
        check: (stats: any) => stats.totalLikesReceived >= 50
    },
    eagle_eye: {
        name: 'Eagle Eye',
        description: 'Identified 5+ false reports',
        icon: '🦅',
        check: (stats: any) => stats.falseReportsCaught >= 5
    },
    community_star: {
        name: 'Community Star',
        description: '100+ total engagement (likes + comments)',
        icon: '🌟',
        check: (stats: any) => (stats.totalLikesReceived + stats.totalCommentsReceived) >= 100
    },
    emergency_reporter: {
        name: 'Emergency Reporter',
        description: 'Reported 5+ emergency issues',
        icon: '🚨',
        check: (stats: any) => stats.emergencyReports >= 5
    }
};

// Check and award badges for a user
export const checkAndAwardBadges = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const stats = {
            totalReports: user.totalReports || 0,
            totalLikesReceived: user.totalLikesReceived || 0,
            totalCommentsReceived: user.totalCommentsReceived || 0,
            emergencyReports: user.emergencyReports || 0,
            falseReportsCaught: 0 // Calculate this separately if needed
        };

        const currentBadges = user.badges || [];
        const newBadges: string[] = [];

        for (const [badgeId, criteria] of Object.entries(BADGE_CRITERIA)) {
            if (!currentBadges.includes(badgeId) && criteria.check(stats)) {
                newBadges.push(badgeId);
            }
        }

        if (newBadges.length > 0) {
            user.badges = [...currentBadges, ...newBadges];
            user.points = (user.points || 0) + (newBadges.length * 50); // 50 points per badge
            await user.save();

            // Send notification for each new badge
            for (const badgeId of newBadges) {
                const badge = BADGE_CRITERIA[badgeId as keyof typeof BADGE_CRITERIA];
                await createNotification(
                    userId,
                    'badge_earned',
                    `${badge.icon} New Badge Earned!`,
                    `Congratulations! You've earned the "${badge.name}" badge. ${badge.description}`,
                    { badge: badgeId }
                );
            }
        }

        return newBadges;
    } catch (error) {
        console.error('Check and award badges error:', error);
        return [];
    }
};

// Get badge info
export const getBadgeInfo = (badgeId: string) => {
    return BADGE_CRITERIA[badgeId as keyof typeof BADGE_CRITERIA] || null;
};

// Get all badges with info
export const getAllBadges = () => {
    return Object.entries(BADGE_CRITERIA).map(([id, info]) => ({
        id,
        ...info
    }));
};

// Award points to user
export const awardPoints = async (userId: string, points: number, reason: string) => {
    try {
        await User.findByIdAndUpdate(userId, {
            $inc: { points }
        });
        console.log(`Awarded ${points} points to user ${userId} for: ${reason}`);
    } catch (error) {
        console.error('Award points error:', error);
    }
};
