import React from 'react';

type Badge = {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned?: boolean;
    earnedAt?: string;
};

const BADGE_INFO: Record<string, { name: string; description: string; icon: string }> = {
    first_report: {
        name: 'First Report',
        description: 'Submitted your first complaint',
        icon: '🎯'
    },
    top_contributor: {
        name: 'Top Contributor',
        description: 'Submitted 10+ complaints',
        icon: '⭐'
    },
    neighborhood_hero: {
        name: 'Neighborhood Hero',
        description: 'Submitted 50+ complaints',
        icon: '🦸'
    },
    helpful: {
        name: 'Helpful',
        description: 'Received 50+ likes on your reports',
        icon: '👍'
    },
    eagle_eye: {
        name: 'Eagle Eye',
        description: 'Identified 5+ false reports',
        icon: '🦅'
    },
    community_star: {
        name: 'Community Star',
        description: '100+ total engagement',
        icon: '🌟'
    },
    emergency_reporter: {
        name: 'Emergency Reporter',
        description: 'Reported 5+ emergency issues',
        icon: '🚨'
    },
    verified_citizen: {
        name: 'Verified Citizen',
        description: 'Email verified account',
        icon: '✅'
    },
    quick_responder: {
        name: 'Quick Responder',
        description: 'Fast response time',
        icon: '⚡'
    },
    accurate: {
        name: 'Accurate',
        description: 'High accuracy rate',
        icon: '🎯'
    },
};

// Small inline badge display
export function BadgeIcon({ badgeId, size = 'small' }: { badgeId: string; size?: 'small' | 'medium' | 'large' }) {
    const badge = BADGE_INFO[badgeId];
    if (!badge) return null;

    const sizeStyles = {
        small: { fontSize: '1rem', padding: '4px' },
        medium: { fontSize: '1.25rem', padding: '6px' },
        large: { fontSize: '1.5rem', padding: '8px' },
    };

    return (
        <span
            className="badge-icon"
            title={`${badge.name}: ${badge.description}`}
            style={sizeStyles[size]}
        >
            {badge.icon}
        </span>
    );
}

// Badge row display (shows earned badges inline)
export function BadgeRow({ badges, maxDisplay = 5 }: { badges: string[]; maxDisplay?: number }) {
    if (!badges || badges.length === 0) return null;

    const displayBadges = badges.slice(0, maxDisplay);
    const remaining = badges.length - maxDisplay;

    return (
        <div className="badge-row">
            {displayBadges.map(badgeId => (
                <BadgeIcon key={badgeId} badgeId={badgeId} size="small" />
            ))}
            {remaining > 0 && (
                <span className="badge-more">+{remaining}</span>
            )}

            <style>{`
                .badge-row {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                .badge-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--hover-bg);
                    border-radius: 6px;
                    cursor: default;
                }
                .badge-more {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    padding: 4px 6px;
                }
            `}</style>
        </div>
    );
}

// Full badge card
export function BadgeCard({ badgeId, earned = false }: { badgeId: string; earned?: boolean }) {
    const badge = BADGE_INFO[badgeId];
    if (!badge) return null;

    return (
        <div className={`badge-card ${earned ? 'earned' : 'locked'}`}>
            <div className="badge-card-icon">{badge.icon}</div>
            <div className="badge-card-info">
                <div className="badge-card-name">{badge.name}</div>
                <div className="badge-card-desc">{badge.description}</div>
            </div>
            {earned && <span className="earned-check">✓</span>}

            <style>{`
                .badge-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .badge-card.locked {
                    opacity: 0.5;
                    filter: grayscale(1);
                }
                .badge-card.earned {
                    background: linear-gradient(135deg, 
                        rgba(255, 215, 0, 0.1) 0%,
                        rgba(255, 107, 53, 0.05) 50%,
                        rgba(255, 215, 0, 0.1) 100%
                    );
                    border: 2px solid #ffd700;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
                }
                .badge-card.earned:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
                }
                @keyframes badge-glow {
                    0%, 100% {
                        box-shadow: 
                            0 0 20px rgba(255, 215, 0, 0.4),
                            0 0 40px rgba(255, 71, 87, 0.3),
                            0 4px 15px rgba(0, 0, 0, 0.2);
                    }
                    50% {
                        box-shadow: 
                            0 0 30px rgba(255, 215, 0, 0.6),
                            0 0 60px rgba(255, 71, 87, 0.5),
                            0 6px 20px rgba(0, 0, 0, 0.3);
                    }
                }
                @keyframes badge-gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .badge-card-icon {
                    font-size: 2.5rem;
                    flex-shrink: 0;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                    animation: icon-bounce 2s ease-in-out infinite;
                }
                .badge-card.earned .badge-card-icon {
                    animation: icon-float 3s ease-in-out infinite;
                }
                @keyframes icon-float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                .badge-card-info {
                    flex: 1;
                }
                .badge-card.earned .badge-card-name {
                    background: linear-gradient(135deg, #ffd700, #ff6b35, #ff4757, #ffd700);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: text-glow-gradient 4s ease infinite;
                    font-weight: 800;
                    font-size: 1.1rem;
                }
                .badge-card.earned .badge-card-desc {
                    color: #b45309;
                    font-weight: 600;
                }
                [data-theme='dark'] .badge-card.earned .badge-card-desc {
                    color: #fcd34d;
                }
                @keyframes text-glow-gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .badge-card-name {
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-primary);
                    margin-bottom: 2px;
                }
                .badge-card-desc {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .earned-check {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    color: #fff;
                    background: #10b981;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1rem;
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
                    animation: check-pulse 2s ease-in-out infinite;
                }
                @keyframes check-pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }
            `}</style>
        </div>
    );
}

// Badge grid showing all badges
export function BadgeGrid({ earnedBadges }: { earnedBadges: string[] }) {
    const allBadgeIds = Object.keys(BADGE_INFO);

    return (
        <div className="badge-grid">
            {allBadgeIds.map(badgeId => (
                <BadgeCard
                    key={badgeId}
                    badgeId={badgeId}
                    earned={earnedBadges.includes(badgeId)}
                />
            ))}

            <style>{`
                .badge-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 16px;
                }
                @media (max-width: 640px) {
                    .badge-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

// Points display
export function PointsDisplay({ points }: { points: number }) {
    return (
        <div className="points-display">
            <span className="points-icon">🏆</span>
            <span className="points-value">{points}</span>
            <span className="points-label">points</span>

            <style>{`
                .points-display {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                }
                [data-theme='dark'] .points-display {
                    background: linear-gradient(135deg, #3d3319 0%, #4a3f1f 100%);
                    border: 1px solid #6b5a2e;
                }
                .points-icon {
                    font-size: 1rem;
                }
                .points-value {
                    font-weight: 700;
                    color: #92400e;
                }
                [data-theme='dark'] .points-value {
                    color: #fcd34d;
                }
                .points-label {
                    color: #b45309;
                    font-size: 0.75rem;
                }
                [data-theme='dark'] .points-label {
                    color: #fbbf24;
                }
            `}</style>
        </div>
    );
}

export { BADGE_INFO };
