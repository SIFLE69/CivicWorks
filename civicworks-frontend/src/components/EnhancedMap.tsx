import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Report = {
    _id: string;
    category: string;
    description?: string;
    lat: number;
    lng: number;
    status: string;
    isEmergency?: boolean;
    priority?: string;
    createdAt: string;
    photos?: string[];
    user?: { name: string };
};

// Color scheme for different statuses
const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b',      // Amber
    under_review: '#3b82f6', // Blue
    in_progress: '#8b5cf6',  // Purple
    resolved: '#10b981',     // Green
    rejected: '#6b7280',     // Gray
};

const PRIORITY_COLORS: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
};

// Create colored SVG markers
const createColoredMarker = (color: string, isEmergency: boolean = false) => {
    const svg = `
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 26 16 26s16-14 16-26c0-8.836-7.164-16-16-16z" fill="${color}"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
            ${isEmergency ? '<text x="16" y="20" text-anchor="middle" fill="' + color + '" font-size="12" font-weight="bold">!</text>' : ''}
        </svg>
    `;
    return L.divIcon({
        html: svg,
        className: 'custom-marker',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
    });
};

// User location marker
const userLocationIcon = L.divIcon({
    html: `
        <div style="
            width: 24px;
            height: 24px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
    `,
    className: 'user-location-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// Cluster component
function Cluster({ reports, onClick }: { reports: Report[]; onClick: (reports: Report[]) => void }) {
    const center = useMemo(() => {
        const lats = reports.map(r => r.lat);
        const lngs = reports.map(r => r.lng);
        return {
            lat: lats.reduce((a, b) => a + b, 0) / lats.length,
            lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
        };
    }, [reports]);

    const hasEmergency = reports.some(r => r.isEmergency);
    const color = hasEmergency ? '#ef4444' : '#3b82f6';

    return (
        <CircleMarker
            center={[center.lat, center.lng]}
            radius={Math.min(30, 15 + reports.length * 2)}
            pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 2,
            }}
            eventHandlers={{
                click: () => onClick(reports),
            }}
        >
            <Popup>
                <div className="cluster-popup">
                    <strong>{reports.length} complaints</strong>
                    <p>Click to zoom in</p>
                </div>
            </Popup>
        </CircleMarker>
    );
}

// Auto-fit bounds component
function FitBounds({ reports, userPos }: { reports: Report[]; userPos?: { lat: number; lng: number } | null }) {
    const map = useMap();

    useEffect(() => {
        if (reports.length === 0 && userPos) {
            map.setView([userPos.lat, userPos.lng], 13);
            return;
        }

        if (reports.length === 0) return;

        const bounds = L.latLngBounds(
            reports.map(r => [r.lat, r.lng] as [number, number])
        );

        if (userPos) {
            bounds.extend([userPos.lat, userPos.lng]);
        }

        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }, [reports, userPos, map]);

    return null;
}

type EnhancedMapProps = {
    reports: Report[];
    userPos?: { lat: number; lng: number } | null;
    onReportClick?: (report: Report) => void;
    selectedReportId?: string;
    height?: string;
    colorBy?: 'status' | 'priority';
    showClusters?: boolean;
    clusterThreshold?: number;
};

export function EnhancedMap({
    reports,
    userPos,
    onReportClick,
    selectedReportId,
    height = '400px',
    colorBy = 'status',
    showClusters = true,
    clusterThreshold = 5,
}: EnhancedMapProps) {
    // Group nearby reports for clustering
    const { clusters, singles } = useMemo(() => {
        if (!showClusters) {
            return { clusters: [], singles: reports };
        }

        const threshold = 0.01; // ~1km
        const grouped: Report[][] = [];
        const used = new Set<string>();

        reports.forEach(report => {
            if (used.has(report._id)) return;

            const nearby = reports.filter(r =>
                !used.has(r._id) &&
                Math.abs(r.lat - report.lat) < threshold &&
                Math.abs(r.lng - report.lng) < threshold
            );

            if (nearby.length >= clusterThreshold) {
                grouped.push(nearby);
                nearby.forEach(r => used.add(r._id));
            }
        });

        const singles = reports.filter(r => !used.has(r._id));
        return { clusters: grouped, singles };
    }, [reports, showClusters, clusterThreshold]);

    const getMarkerColor = (report: Report) => {
        if (report.isEmergency) return '#ef4444';
        if (colorBy === 'priority') {
            return PRIORITY_COLORS[report.priority || 'medium'];
        }
        return STATUS_COLORS[report.status] || STATUS_COLORS.pending;
    };

    const defaultCenter: [number, number] = userPos
        ? [userPos.lat, userPos.lng]
        : [20.5937, 78.9629]; // India center

    return (
        <div className="enhanced-map-container" style={{ height }}>
            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <FitBounds reports={reports} userPos={userPos} />

                {/* User location */}
                {userPos && (
                    <Marker position={[userPos.lat, userPos.lng]} icon={userLocationIcon}>
                        <Popup>
                            <strong>Your Location</strong>
                        </Popup>
                    </Marker>
                )}

                {/* Clusters */}
                {clusters.map((cluster, i) => (
                    <Cluster
                        key={`cluster-${i}`}
                        reports={cluster}
                        onClick={() => { }}
                    />
                ))}

                {/* Individual markers */}
                {singles.map(report => (
                    <Marker
                        key={report._id}
                        position={[report.lat, report.lng]}
                        icon={createColoredMarker(
                            getMarkerColor(report),
                            report.isEmergency
                        )}
                        eventHandlers={{
                            click: () => onReportClick?.(report),
                        }}
                    >
                        <Popup>
                            <div className="report-popup">
                                <div className="popup-header">
                                    <span className="popup-category">{report.category}</span>
                                    <span className={`popup-status status-${report.status}`}>
                                        {report.status.replace('_', ' ')}
                                    </span>
                                </div>
                                {report.isEmergency && (
                                    <div className="popup-emergency">🚨 EMERGENCY</div>
                                )}
                                {report.description && (
                                    <p className="popup-desc">{report.description.slice(0, 100)}...</p>
                                )}
                                {report.photos?.[0] && (
                                    <img src={report.photos[0]} alt="Report" className="popup-image" />
                                )}
                                <div className="popup-footer">
                                    <span>by {report.user?.name || 'Anonymous'}</span>
                                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="map-legend">
                <div className="legend-title">Legend</div>
                <div className="legend-items">
                    {colorBy === 'status' ? (
                        Object.entries(STATUS_COLORS).map(([status, color]) => (
                            <div key={status} className="legend-item">
                                <span className="legend-dot" style={{ background: color }}></span>
                                <span>{status.replace('_', ' ')}</span>
                            </div>
                        ))
                    ) : (
                        Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
                            <div key={priority} className="legend-item">
                                <span className="legend-dot" style={{ background: color }}></span>
                                <span>{priority}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .enhanced-map-container {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .custom-marker {
                    background: none;
                    border: none;
                }
                .user-location-marker {
                    background: none;
                    border: none;
                }
                .report-popup {
                    min-width: 200px;
                    max-width: 280px;
                }
                .popup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .popup-category {
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: capitalize;
                }
                .popup-status {
                    font-size: 0.7rem;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 600;
                    text-transform: capitalize;
                }
                .popup-status.status-pending { background: #fef3c7; color: #92400e; }
                .popup-status.status-under_review { background: #dbeafe; color: #1e40af; }
                .popup-status.status-in_progress { background: #ede9fe; color: #5b21b6; }
                .popup-status.status-resolved { background: #d1fae5; color: #065f46; }
                .popup-status.status-rejected { background: #f3f4f6; color: #374151; }
                .popup-emergency {
                    background: #ef4444;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                    text-align: center;
                }
                .popup-desc {
                    font-size: 0.8rem;
                    color: #4b5563;
                    margin: 8px 0;
                    line-height: 1.4;
                }
                .popup-image {
                    width: 100%;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 6px;
                    margin: 8px 0;
                }
                .popup-footer {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    color: #6b7280;
                    margin-top: 8px;
                }
                .cluster-popup {
                    text-align: center;
                }
                .map-legend {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 12px;
                    z-index: 1000;
                    box-shadow: var(--shadow-md);
                }
                .legend-title {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }
                .legend-items {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.75rem;
                    color: var(--text-primary);
                    text-transform: capitalize;
                }
                .legend-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                @media (max-width: 640px) {
                    .map-legend {
                        bottom: 10px;
                        right: 10px;
                        padding: 8px;
                    }
                }
            `}</style>
        </div>
    );
}

export { STATUS_COLORS, PRIORITY_COLORS };
