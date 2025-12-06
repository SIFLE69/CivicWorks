import React, { useState } from 'react';
import { escalateReport, deEscalateReport } from '../lib/api';

type EscalationButtonProps = {
    reportId: string;
    isEmergency?: boolean;
    onEscalated?: () => void;
};

export function EscalationButton({ reportId, isEmergency, onEscalated }: EscalationButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (isEmergency) {
        return (
            <div className="escalation-status">
                <span className="emergency-badge">🚨 EMERGENCY</span>
                <DeEscalateButton reportId={reportId} onDeEscalated={onEscalated} />
            </div>
        );
    }

    const handleEscalate = async () => {
        if (!reason.trim()) {
            setError('Please provide a reason for escalation');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await escalateReport(reportId, reason);
            setShowModal(false);
            setReason('');
            onEscalated?.();
        } catch (err) {
            setError('Failed to escalate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="escalation-btn"
                onClick={() => setShowModal(true)}
                title="Mark as emergency for priority handling"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Escalate
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content escalation-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🚨 Escalate to Emergency</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <p className="escalation-warning">
                                Escalating this report will mark it as an emergency and prioritize it for immediate attention.
                                Please only use this for genuine emergencies.
                            </p>

                            <div className="escalation-reasons">
                                <p className="reason-label">Quick reasons:</p>
                                <div className="reason-chips">
                                    {[
                                        'Safety hazard',
                                        'Blocking traffic',
                                        'Risk of injury',
                                        'Urgent repair needed',
                                        'Public health risk',
                                        'No action taken for days'
                                    ].map(r => (
                                        <button
                                            key={r}
                                            className={`reason-chip ${reason === r ? 'selected' : ''}`}
                                            onClick={() => setReason(r)}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Reason for escalation</label>
                                <textarea
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="Describe why this needs immediate attention..."
                                    rows={3}
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}
                        </div>

                        <div className="modal-footer">
                            <button className="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="primary danger"
                                onClick={handleEscalate}
                                disabled={loading}
                            >
                                {loading ? 'Escalating...' : '🚨 Escalate to Emergency'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .escalation-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    background: transparent;
                    border: 1px solid var(--danger);
                    color: var(--danger);
                    border-radius: 8px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .escalation-btn:hover {
                    background: var(--danger);
                    color: white;
                }
                .escalation-status {
                    display: inline-flex;
                }
                .emergency-badge {
                    background: var(--danger);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    animation: emergency-pulse 2s infinite;
                }
                @keyframes emergency-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .escalation-modal {
                    max-width: 500px;
                }
                .escalation-warning {
                    background: #fef3c7;
                    border: 1px solid #fcd34d;
                    color: #92400e;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    margin-bottom: 20px;
                }
                [data-theme='dark'] .escalation-warning {
                    background: rgba(254, 243, 199, 0.1);
                    border-color: #fcd34d;
                    color: #fde68a;
                }
                .escalation-reasons {
                    margin-bottom: 20px;
                }
                .reason-label {
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }
                .reason-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .reason-chip {
                    all: unset;
                    cursor: pointer;
                    padding: 6px 12px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                }
                .reason-chip:hover {
                    border-color: var(--text-muted);
                    color: var(--text-primary);
                }
                .reason-chip.selected {
                    background: var(--brand-primary);
                    border-color: var(--brand-primary);
                    color: var(--bg-secondary);
                }
                .form-group label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: var(--text-primary);
                }
                .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.9375rem;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    resize: vertical;
                }
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                }
                .error-message {
                    color: var(--danger);
                    font-size: 0.875rem;
                    margin-top: 12px;
                }
                .modal-footer {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    padding: 16px 24px;
                    border-top: 1px solid var(--border-color);
                }
                .primary.danger {
                    background: var(--danger);
                }
                .primary.danger:hover {
                    background: #b91c1c;
                }
            `}</style>
        </>
    );
}

// Emergency indicator for map and lists
export function EmergencyIndicator({ isEmergency, priority }: { isEmergency?: boolean; priority?: string }) {
    if (!isEmergency && priority !== 'critical' && priority !== 'high') {
        return null;
    }

    return (
        <div className={`emergency-indicator ${isEmergency ? 'is-emergency' : ''} priority-${priority}`}>
            {isEmergency ? '🚨' : priority === 'critical' ? '⚠️' : '❗'}
            <span>{isEmergency ? 'Emergency' : priority === 'critical' ? 'Critical' : 'High Priority'}</span>

            <style>{`
                .emergency-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .emergency-indicator.is-emergency {
                    background: var(--danger);
                    color: white;
                }
                .emergency-indicator.priority-critical {
                    background: #fef3c7;
                    color: #92400e;
                }
                .emergency-indicator.priority-high {
                    background: #fee2e2;
                    color: #991b1b;
                }
                [data-theme='dark'] .emergency-indicator.priority-critical {
                    background: rgba(254, 243, 199, 0.2);
                    color: #fde68a;
                }
                [data-theme='dark'] .emergency-indicator.priority-high {
                    background: rgba(254, 226, 226, 0.2);
                    color: #fca5a5;
                }
            `}</style>
        </div>
    );
}

// De-escalate button
export function DeEscalateButton({ reportId, onDeEscalated }: { reportId: string; onDeEscalated?: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleDeEscalate = async () => {
        if (!window.confirm('Remove emergency status from this report?')) return;

        setLoading(true);
        try {
            await deEscalateReport(reportId, 'Emergency status removed by user');
            onDeEscalated?.();
        } catch (error) {
            alert('Failed to remove emergency status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="de-escalate-btn"
            onClick={handleDeEscalate}
            disabled={loading}
            title="Remove emergency status"
        >
            {loading ? '...' : '✕'}
            <style>{`
                .de-escalate-btn {
                    all: unset;
                    cursor: pointer;
                    margin-left: 8px;
                    padding: 4px 8px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    font-weight: 700;
                    transition: all 0.2s;
                }
                .de-escalate-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                .de-escalate-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </button>
    );
}
