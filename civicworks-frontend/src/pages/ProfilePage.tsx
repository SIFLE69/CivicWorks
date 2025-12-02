import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyReports, deleteReport } from '../lib/api';

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
            <h2 className="section-title">
                <span className="badge">Profile</span> Your Account
            </h2>

            <div className="profile-info">
                <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                <div>
                    <h3>{user?.name}</h3>
                    <p style={{ color: '#64748b' }}>{user?.email}</p>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 className="section-title">
                    <span className="badge">Reports</span> Your Complaints ({reports.length})
                </h3>

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
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
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
                                        src={`http://localhost:4000${r.photos[0]}`}
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
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    color: white;
                }
                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: white;
                    color: #667eea;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                }
                .profile-info h3 {
                    margin: 0;
                    font-size: 1.5rem;
                }
                .profile-info p {
                    margin: 0.5rem 0 0 0;
                    opacity: 0.9;
                }
                .profile-report-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }
                .profile-report-stats {
                    display: flex;
                    gap: 2rem;
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    border-top: 1px solid #f1f5f9;
                    border-bottom: 1px solid #f1f5f9;
                    font-size: 0.9rem;
                    color: #64748b;
                }
                .delete-btn {
                    background: #ef4444;
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
                    background: #dc2626;
                }
            `}</style>
        </section>
    );
}
