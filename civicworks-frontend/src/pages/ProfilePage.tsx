import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyReports, deleteReport } from '../lib/api';
import { BadgeGrid, PointsDisplay } from '../components/BadgeDisplay';

type Report = {
    _id: string;
    category: string;
    description?: string;
    lat: number;
    lng: number;
    status: string;
    createdAt: string;
    photos?: string[];
    likes: string[];
    dislikes: string[];
    falseReports: string[];
};

export default function ProfilePage() {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [badgesExpanded, setBadgesExpanded] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await getMyReports();
            setReports(data);
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;

        try {
            await deleteReport(id);
            setReports(reports.filter(r => r._id !== id));
        } catch (error) {
            console.error('Failed to delete report:', error);
            alert('Failed to delete complaint');
        }
    };

    if (loading) {
        return <div className="section">Loading...</div>;
    }

    return (
        <section className="section">

            <div className="profile-info">
                <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                    <h3>{user?.name}</h3>
                    <p>{user?.email}</p>
                    <div style={{ marginTop: '8px' }}>
                        <PointsDisplay points={user?.points || 0} />
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            <div style={{ marginTop: '2rem' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: badgesExpanded ? '1rem' : 0,
                        cursor: 'pointer',
                        padding: '8px 0'
                    }}
                    onClick={() => setBadgesExpanded(!badgesExpanded)}
                >
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                        🏆 Your Badges ({user?.badges?.length || 0})
                    </h3>
                    <button
                        style={{
                            all: 'unset',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            background: 'var(--hover-bg)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {badgesExpanded ? '▲ Minimize' : '▼ Expand'}
                    </button>
                </div>

                {badgesExpanded && (
                    <BadgeGrid earnedBadges={user?.badges || []} />
                )}
            </div>

            <div style={{ marginTop: '2rem' }}>

                {reports.length === 0 ? (
                    <div className="helper" style={{ padding: 48, textAlign: 'center' }}>
                        You haven't submitted any complaints yet.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reports.map(r => (
                            <article key={r._id} className="profile-report-card">
                                <div className="post-header">
                                    <div className="post-category">{r.category}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {r.description && (
                                    <div className="post-content">
                                        <p>{r.description}</p>
                                    </div>
                                )}

                                {r.photos?.[0] && (
                                    <img
                                        src={r.photos[0]}
                                        alt="Report"
                                        className="post-image"
                                        style={{ width: '100%', borderRadius: '8px' }}
                                    />
                                )}

                                <div className="profile-report-stats">
                                    <span>👍 {r.likes?.length || 0} likes</span>
                                    <span>👎 {r.dislikes?.length || 0} dislikes</span>
                                    <span>🚩 {r.falseReports?.length || 0} reports</span>
                                </div>

                                <div className="post-footer">
                                    <div className="post-location">
                                        📍 {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(r._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .profile-info {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: var(--brand-primary);
                    border-radius: 16px;
                    color: var(--bg-secondary);
                }
                @media (max-width: 640px) {
                    .profile-info {
                        flex-direction: column;
                        text-align: center;
                        padding: 1.5rem;
                    }
                }
                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--bg-secondary);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                @media (max-width: 640px) {
                    .profile-avatar {
                        width: 60px;
                        height: 60px;
                        font-size: 1.5rem;
                    }
                }
                .profile-info h3 {
                    margin: 0;
                    font-size: 1.5rem;
                }
                @media (max-width: 640px) {
                    .profile-info h3 {
                        font-size: 1.25rem;
                    }
                }
                .profile-info p {
                    margin: 0.5rem 0 0 0;
                    opacity: 0.9;
                    color: var(--bg-secondary);
                }
                .profile-report-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                }
                .profile-report-stats {
                    display: flex;
                    gap: 1.5rem;
                    padding: 1rem 1.5rem;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    flex-wrap: wrap;
                }
                @media (max-width: 640px) {
                    .profile-report-stats {
                        gap: 1rem;
                        padding: 0.75rem 1rem;
                        font-size: 0.8rem;
                    }
                }
                .delete-btn {
                    background: var(--danger);
                    color: white;
                    border: none;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .delete-btn:hover {
                    background: #b91c1c;
                    box-shadow: var(--shadow-md);
                }
                @media (max-width: 640px) {
                    .delete-btn {
                        padding: 0.4rem 1rem;
                        font-size: 0.85rem;
                    }
                }
            `}</style>
        </section>
    );
}
