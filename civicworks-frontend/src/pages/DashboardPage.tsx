import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getReports, createReportMultipart, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../lib/api";
import CameraCapture from "../components/CameraCapture";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { FeedPost } from "../components/FeedPost";
import { NotificationBell } from "../components/NotificationBell";
import { SearchFilter } from "../components/SearchFilter";
import { EscalationButton, EmergencyIndicator } from "../components/EmergencyEscalation";
import { BadgeRow } from "../components/BadgeDisplay";
// Fix Leaflet icon paths for CRA
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Report = {
    id: string;
    _id: string;
    category: string;
    description?: string;
    lat: number;
    lng: number;
    status: string;
    created_at: string;
    createdAt: string;
    photos?: string[];
    user?: { name: string; _id: string; badges?: string[] };
    likes?: string[];
    dislikes?: string[];
    falseReports?: string[];
    isEmergency?: boolean;
    priority?: string;
    escalatedAt?: string;
};

type TabKey = "feed" | "complaint" | "nearby" | "profile" | "about" | "notifications";

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (d: number) => d * Math.PI / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Helper to pan map when we need to refocus */
function PanTo({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => { map.setView(center, Math.max(map.getZoom(), 13), { animate: true }); }, [center, map]);
    return null;
}

export default function DashboardPage() {
    const [tab, setTabState] = useState<TabKey>("feed");
    const [reports, setReports] = useState<Report[]>([]);
    const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("theme") as "light" | "dark") || "light");
    const [justSubmittedAt, setJustSubmittedAt] = useState<number>(0); // for pulsing new marker
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Custom setTab that also updates browser history
    const setTab = (newTab: TabKey) => {
        if (newTab !== tab) {
            window.history.pushState({ tab: newTab }, '', `#${newTab}`);
            setTabState(newTab);
        }
    };

    // Listen for browser back/forward button
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            const state = e.state;
            if (state?.tab) {
                setTabState(state.tab);
            } else {
                // Check URL hash
                const hash = window.location.hash.replace('#', '') as TabKey;
                if (['feed', 'complaint', 'nearby', 'profile', 'about', 'notifications'].includes(hash)) {
                    setTabState(hash);
                } else {
                    setTabState('feed');
                }
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Set initial state based on hash
        const hash = window.location.hash.replace('#', '') as TabKey;
        if (['feed', 'complaint', 'nearby', 'profile', 'about'].includes(hash)) {
            setTabState(hash);
            window.history.replaceState({ tab: hash }, '', `#${hash}`);
        } else {
            window.history.replaceState({ tab: 'feed' }, '', '#feed');
        }

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    async function load(filterParams?: any) {
        try {
            const data = await getReports(filterParams || filters);
            setReports(data.reports || data);
        } catch (e) {
            console.error("Failed to load reports", e);
        }
    }

    // theme apply
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // initial load + geolocate
    useEffect(() => {
        load();
        navigator.geolocation.getCurrentPosition(
            (pos) => setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setMyPos(null),
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }, []);

    const nearby5km = useMemo(() => {
        if (!myPos) return [];
        return reports.filter(r => distanceMeters(myPos.lat, myPos.lng, r.lat, r.lng) <= 5000);
    }, [reports, myPos]);

    return (
        <div className="app-shell">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}

            <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand">
                        <img src="/logo.png" alt="CW" className="brand-logo-img" />
                        <div>
                            <div className="brand-title">CivicWorks</div>
                            <div style={{ fontSize: 12, opacity: .8 }}>Public Infrastructure</div>
                        </div>
                    </div>
                    <button className="close-menu-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                        ✕
                    </button>
                </div>

                <div className="nav" role="navigation" aria-label="Primary">
                    <button className={tab === 'feed' ? 'active' : ''} onClick={() => { setTab('feed'); setMobileMenuOpen(false); }}>
                        Feed
                    </button>
                    <button className={tab === 'complaint' ? 'active' : ''} onClick={() => { setTab('complaint'); setMobileMenuOpen(false); }}>
                        New Complaint
                    </button>
                    <button className={tab === 'nearby' ? 'active' : ''} onClick={() => { setTab('nearby'); setMobileMenuOpen(false); }}>
                        Map View
                    </button>
                    <button className={tab === 'profile' ? 'active' : ''} onClick={() => { setTab('profile'); setMobileMenuOpen(false); }}>
                        Profile
                    </button>
                    <button className={tab === 'about' ? 'active' : ''} onClick={() => { setTab('about'); setMobileMenuOpen(false); }}>
                        About
                    </button>
                    <button className={tab === 'notifications' ? 'active' : ''} onClick={() => { setTab('notifications'); setMobileMenuOpen(false); }}>
                        Notifications
                    </button>
                </div>

                <div className="theme-switch">
                    <span>Theme:</span>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </div>

                <div style={{ padding: 16, marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Welcome, {user?.name}
                    </p>
                    <button className="secondary" onClick={() => { logout(); navigate('/'); }}>Logout</button>
                </div>
            </aside>

            {/* Main */}
            <main className="main">
                <div className="header">
                    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Dashboard</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button className="header-search-btn" onClick={() => setMobileSearchOpen(true)} aria-label="Search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                        <NotificationBell />
                    </div>
                </div>

                <div className="kpis">
                    <div className="kpi"><h4>All Complaints</h4><div className="v">{reports.length}</div></div>
                    <div className="kpi"><h4>Nearby (5 km)</h4><div className="v">{myPos ? nearby5km.length : "-"}</div></div>
                </div>

                {tab === "feed" && (
                    <FeedSection
                        reports={reports}
                        onRefresh={load}
                        onViewOnMap={(lat, lng) => {
                            setMyPos({ lat, lng });
                            setTab("nearby");
                        }}
                        onFilter={(newFilters) => {
                            setFilters(newFilters);
                            load(newFilters);
                        }}
                    />
                )}

                {tab === "complaint" && (
                    <ComplaintSection
                        onSubmitted={async () => {
                            await load();
                            setJustSubmittedAt(Date.now());
                            setTab("feed");
                        }}
                    />
                )}

                {tab === "nearby" && (
                    <NearbySection
                        myPos={myPos}
                        reports={reports}
                        nearby={nearby5km}
                        onRefresh={load}
                        justSubmittedAt={justSubmittedAt}
                    />
                )}

                {tab === "profile" && <ProfilePage />}

                {tab === "about" && <AboutSection />}

                {tab === "notifications" && <NotificationsSection />}

                {mobileSearchOpen && (
                    <MobileSearchOverlay
                        onClose={() => setMobileSearchOpen(false)}
                        onFilter={(newFilters) => {
                            setFilters(newFilters);
                            load(newFilters);
                            setMobileSearchOpen(false);
                            setTab('feed');
                        }}
                    />
                )}
            </main>
            <style>{`
                .brand-logo-img {
                    height: 40px;
                    width: auto;
                    object-fit: contain;
                    display: block;
                }
            `}</style>
        </div>
    );
}

/* -------- Complaint Section (camera-only capture) -------- */
function ComplaintSection({ onSubmitted }: { onSubmitted: () => void }) {
    const [category, setCategory] = useState("road");
    const [description, setDescription] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");
    const [capturedAt, setCapturedAt] = useState<number>(0);
    const [statusMsg, setStatusMsg] = useState<string>("");
    const [cameraOpen, setCameraOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [priority, setPriority] = useState("medium");
    const [isEmergency, setIsEmergency] = useState(false);

    function openCamera() {
        setStatusMsg("");
        setCameraOpen(true);
    }

    function onCaptured(r: { blob: Blob; dataUrl: string; lat: number; lng: number; capturedAt: number }) {
        setPhotoBlob(r.blob);
        setPhotoPreview(r.dataUrl);
        setLat(String(r.lat));
        setLng(String(r.lng));
        setCapturedAt(r.capturedAt);
        setStatusMsg("Captured via camera. Location recorded.");
    }

    function useMyLocation() {
        setStatusMsg("Getting your location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(String(pos.coords.latitude));
                setLng(String(pos.coords.longitude));
                setStatusMsg(`Location set: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setStatusMsg(`Location error: ${error.message}. Please enter coordinates manually or check browser permissions.`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!photoBlob) { alert("Capture a photo using the camera."); return; }

        // enforce ≤ 5 minutes freshness
        const ageMs = Date.now() - capturedAt;
        if (ageMs > 5 * 60 * 1000) { alert("Photo is older than 5 minutes. Capture again on the spot."); return; }

        if (!lat || !lng) { alert("Location missing. Allow location or use 'Use my location'."); return; }

        setBusy(true);
        const fd = new FormData();
        fd.append("category", category);
        fd.append("description", description);
        fd.append("lat", lat);
        fd.append("lng", lng);
        fd.append("photo", photoBlob, `capture-${Date.now()}.jpg`);
        fd.append("priority", priority);
        fd.append("isEmergency", String(isEmergency));

        try {
            await createReportMultipart(fd);
            onSubmitted();
            setDescription(""); setLat(""); setLng(""); setPhotoBlob(null); setPhotoPreview(""); setCapturedAt(0); setStatusMsg("");
        } catch (e) {
            alert("Failed to submit report");
        } finally {
            setBusy(false);
        }
    }

    return (
        <section className="section" aria-labelledby="new-complaint">

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }}>
                        <option value="road">Road</option>
                        <option value="water">Water</option>
                        <option value="sewage">Sewage</option>
                        <option value="streetlight">Streetlight</option>
                        <option value="bridge">Bridge</option>
                        <option value="building">Building</option>
                        <option value="park">Park</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Location</label>
                    <div className="row" style={{ gap: '12px' }}>
                        <input className="input" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} style={{ flex: 1 }} />
                        <input className="input" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} style={{ flex: 1 }} />
                        <button type="button" className="secondary" onClick={useMyLocation} style={{ whiteSpace: 'nowrap' }}>Use my location</button>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
                    <input className="input" placeholder="Describe the issue" style={{ width: '100%' }} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%' }}>
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🟠 High</option>
                        <option value="critical">🔴 Critical</option>
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={isEmergency}
                            onChange={(e) => {
                                setIsEmergency(e.target.checked);
                                if (e.target.checked) setPriority('critical');
                            }}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: isEmergency ? 'var(--danger)' : 'var(--text-secondary)' }}>
                            🚨 Mark as Emergency
                        </span>
                    </label>
                    {isEmergency && (
                        <div className="helper" style={{ marginTop: '8px', color: 'var(--danger)' }}>
                            Emergency reports get priority handling and immediate notifications to authorities.
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Photo Evidence</label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <button type="button" className="primary" onClick={openCamera} style={{ width: '100%', marginBottom: '12px' }}>Open Camera</button>
                            <div className="helper">{statusMsg || "Click 'Open Camera' to capture. Gallery pick is disabled."}</div>
                        </div>
                        {photoPreview && (
                            <div style={{ flex: '0 0 auto', maxWidth: '280px' }}>
                                <img className="preview" src={photoPreview} alt="Captured" style={{ width: '100%', height: 'auto' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <button className="primary" type="submit" disabled={busy} style={{ minWidth: '180px' }}>
                        {busy ? "Submitting..." : "Register Complaint"}
                    </button>
                </div>
            </form>

            <CameraCapture
                open={cameraOpen}
                onClose={() => setCameraOpen(false)}
                onCaptured={onCaptured}
            />
        </section>
    );
}

/* -------- Nearby (map + list within 5 km; pan to you; pulse new) -------- */
function NearbySection({
    myPos, reports, nearby, onRefresh, justSubmittedAt
}: {
    myPos: { lat: number; lng: number } | null;
    reports: Report[];
    nearby: Report[];
    onRefresh: () => void;
    justSubmittedAt: number;
}) {
    const shouldPulse = (created_at: string) => {
        const created = new Date(created_at).getTime();
        return justSubmittedAt && Math.abs(justSubmittedAt - created) < 2 * 60 * 1000; // within 2 minutes
    };

    // Smart center: use user position if available, otherwise use first report, otherwise default
    const center: [number, number] = myPos
        ? [myPos.lat, myPos.lng]
        : reports.length > 0
            ? [reports[0].lat, reports[0].lng]
            : [28.6139, 77.209]; // Default to Delhi

    // Show nearby if we have user position, otherwise show all reports
    const displayReports = myPos ? nearby : reports;

    return (
        <>
            <section className="section">

                {!myPos && reports.length > 0 && (
                    <div className="helper" style={{ marginBottom: 12, padding: 12, background: '#fef3c7', borderRadius: 8 }}>
                        ℹ️ Location access not available. Showing all complaints. Enable location to see nearby complaints within 5km.
                    </div>
                )}

                <div className="map-wrap">
                    <MapContainer center={center} zoom={myPos ? 13 : 12} className="map">
                        <PanTo center={center} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                        {myPos && (
                            <>
                                <Marker position={[myPos.lat, myPos.lng]}>
                                    <Popup><b>Your Location</b><br />{myPos.lat.toFixed(5)}, {myPos.lng.toFixed(5)}</Popup>
                                </Marker>
                                <Circle center={[myPos.lat, myPos.lng]} radius={5000} pathOptions={{ color: "#667eea", fillColor: "#667eea", fillOpacity: 0.1 }} />
                            </>
                        )}
                        {displayReports.map(r => (
                            <Marker key={r.id} position={[r.lat, r.lng]} icon={
                                shouldPulse(r.created_at)
                                    ? L.divIcon({ className: "pulse", html: "", iconSize: [12, 12] })
                                    : new L.Icon.Default()
                            }>
                                <Popup>
                                    <b>{r.category}</b><br />{r.description || "(no description)"}<br />{r.lat}, {r.lng}<br />
                                    {r.photos?.[0] && <img src={r.photos[0]} alt="evidence" style={{ maxWidth: 160, marginTop: 6 }} />}
                                    <br /><i>Reported by: {r.user?.name || 'Unknown'}</i>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="section" style={{ marginTop: 12 }}>
                    {displayReports.length === 0 ? (
                        <div className="helper" style={{ padding: 24, textAlign: 'center' }}>
                            No complaints found. Be the first to report an issue!
                        </div>
                    ) : (
                        <div className="list">
                            {displayReports.map(r => (
                                <article key={r.id} className="card">
                                    <div className="meta">
                                        <span><b>Category:</b> {r.category}</span>
                                        <span><b>Coords:</b> {r.lat.toFixed(5)}, {r.lng.toFixed(5)}</span>
                                        <span><b>Time:</b> {new Date(r.created_at).toLocaleString()}</span>
                                    </div>
                                    {r.photos?.[0] && <img src={r.photos[0]} alt="evidence" />}
                                    <div>{r.description || "(no description)"}</div>
                                    <div style={{ fontSize: '0.8em', color: '#666' }}>Reported by: {r.user?.name || 'Unknown'}</div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

/* -------- Feed (Social Media Style) -------- */
function FeedSection({
    reports,
    onRefresh,
    onViewOnMap,
    onFilter
}: {
    reports: Report[];
    onRefresh: () => void;
    onViewOnMap: (lat: number, lng: number) => void;
    onFilter?: (filters: any) => void;
}) {
    return (
        <section className="section">

            {reports.length === 0 ? (
                <div className="helper" style={{ padding: 48, textAlign: 'center', fontSize: '1.1rem' }}>
                    No reports yet. Be the first to report an issue!
                </div>
            ) : (
                <div className="feed-list">
                    {reports.map(report => (
                        <FeedPost
                            key={report._id || report.id}
                            report={report}
                            onViewOnMap={onViewOnMap}
                            onUpdate={onRefresh}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}





/* -------- Mobile Search Overlay (YouTube Style with Filters) -------- */
function MobileSearchOverlay({ onClose, onFilter }: { onClose: () => void; onFilter: (filters: any) => void }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchResults, setSearchResults] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [isEmergency, setIsEmergency] = useState(false);
    const [nearMe, setNearMe] = useState(false);

    useEffect(() => {
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    const performSearch = async (filters: any) => {
        setLoading(true);
        setHasSearched(true);
        try {
            const { getReports } = await import('../lib/api');
            const data = await getReports(filters);
            setSearchResults(data.reports || []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filters: any = {};

        if (searchQuery.trim()) {
            const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
            filters.search = searchQuery;
        }

        if (selectedCategory !== 'all') filters.category = selectedCategory;
        if (selectedStatus !== 'all') filters.status = selectedStatus;
        if (selectedPriority !== 'all') filters.priority = selectedPriority;
        if (isEmergency) filters.isEmergency = true;
        if (nearMe) filters.nearMe = true;

        performSearch(filters);
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        performSearch({ search: query });
    };

    const handleQuickFilter = (filterType: string, value: any) => {
        const filters: any = {};
        if (filterType === 'category') {
            setSelectedCategory(value);
            filters.category = value;
        } else if (filterType === 'priority') {
            setSelectedPriority(value);
            filters.priority = value;
        } else if (filterType === 'emergency') {
            setIsEmergency(true);
            filters.isEmergency = true;
        } else if (filterType === 'nearMe') {
            setNearMe(true);
            filters.nearMe = true;
        }
        performSearch(filters);
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedStatus('all');
        setSelectedPriority('all');
        setIsEmergency(false);
        setNearMe(false);
    };

    const activeFilterCount = [
        selectedCategory !== 'all',
        selectedStatus !== 'all',
        selectedPriority !== 'all',
        isEmergency,
        nearMe
    ].filter(Boolean).length;

    return (
        <div className="search-overlay">
            <div className="search-overlay-header">
                <button className="back-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div className="search-input-container">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search complaints..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        autoFocus
                    />
                    {searchQuery && (
                        <button className="clear-input-btn" onClick={() => setSearchQuery('')}>
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="search-toolbar">
                <button
                    className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filters
                    {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                </button>
                {activeFilterCount > 0 && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Clear all
                    </button>
                )}
                <button className="search-action-btn" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {showFilters && (
                <div className="filters-panel">
                    <div className="filter-group">
                        <label>Category</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="all">All Categories</option>
                            <option value="road">Road</option>
                            <option value="water">Water</option>
                            <option value="sewage">Sewage</option>
                            <option value="streetlight">Streetlight</option>
                            <option value="bridge">Bridge</option>
                            <option value="building">Building</option>
                            <option value="park">Park</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status</label>
                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Priority</label>
                        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
                            <option value="all">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div className="filter-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isEmergency}
                                onChange={(e) => setIsEmergency(e.target.checked)}
                            />
                            <span className="emergency-text">Emergency Only</span>
                        </label>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={nearMe}
                                onChange={(e) => setNearMe(e.target.checked)}
                            />
                            <span className="nearme-text">Near Me (5km)</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="search-content">
                {hasSearched ? (
                    loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading results...
                        </div>
                    ) : searchResults.length > 0 ? (
                        <>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                            </h3>
                            <div className="search-results-list">
                                {searchResults.map(report => (
                                    <FeedPost
                                        key={report._id || report.id}
                                        report={report}
                                        onViewOnMap={(lat, lng) => { }}
                                        onUpdate={() => handleSearch()}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No results found. Try adjusting your filters.
                        </div>
                    )
                ) : (
                    <>
                        {searchHistory.length > 0 && (
                            <>
                                <div className="search-history-header">
                                    <h3>Recent Searches</h3>
                                    <button className="clear-history-btn" onClick={clearHistory}>
                                        Clear
                                    </button>
                                </div>
                                <div className="search-history-list">
                                    {searchHistory.map((query, index) => (
                                        <div key={index} className="history-item" onClick={() => handleHistoryClick(query)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            <span>{query}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="quick-filters">
                            <h3>Quick Filters</h3>
                            <div className="quick-filter-chips">
                                <button onClick={() => handleQuickFilter('category', 'road')}>Road Issues</button>
                                <button onClick={() => handleQuickFilter('category', 'water')}>Water Problems</button>
                                <button onClick={() => handleQuickFilter('priority', 'high')}>High Priority</button>
                                <button onClick={() => handleQuickFilter('emergency', true)}>Emergency</button>
                                <button onClick={() => handleQuickFilter('nearMe', true)}>Near Me</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .search-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--bg-primary);
                    z-index: 1000;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .search-overlay-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: var(--bg-primary);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--border-color);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .back-btn {
                    all: unset;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    color: var(--text-primary);
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    background: var(--hover-bg);
                    transform: scale(1.1);
                }
                .search-input-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: 24px;
                    padding: 0 16px;
                    transition: border-color 0.2s;
                }
                .search-input-container:focus-within {
                    border-color: var(--brand-primary);
                }
                .search-icon {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                .search-input-container input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 12px 0;
                    font-size: 1rem;
                    color: var(--text-primary);
                    outline: none;
                }
                .search-input-container input::placeholder {
                    color: var(--text-muted);
                }
                .clear-input-btn {
                    all: unset;
                    cursor: pointer;
                    color: var(--text-muted);
                    padding: 4px;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                }
                .clear-input-btn:hover {
                    color: var(--text-primary);
                }
                .search-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: var(--bg-primary);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--border-color);
                    position: sticky;
                    top: 64px;
                    z-index: 99;
                }
                .filter-toggle-btn {
                    all: unset;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    border: 2px solid var(--border-color);
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    transition: all 0.2s;
                    position: relative;
                }
                .filter-toggle-btn:hover {
                    border-color: var(--brand-primary);
                    background: var(--hover-bg);
                }
                .filter-toggle-btn.active {
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                    background: rgba(17, 24, 39, 0.05);
                }
                [data-theme='dark'] .filter-toggle-btn.active {
                    background: rgba(255, 255, 255, 0.05);
                }
                .filter-badge {
                    background: var(--brand-primary);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 700;
                    min-width: 18px;
                    height: 18px;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 6px;
                }
                .clear-filters-btn {
                    all: unset;
                    cursor: pointer;
                    font-size: 0.875rem;
                    color: var(--danger);
                    font-weight: 500;
                    padding: 6px 12px;
                }
                .search-action-btn {
                    all: unset;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 8px 20px;
                    background: var(--brand-primary);
                    color: white;
                    font-weight: 600;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }
                .search-action-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .filters-panel {
                    padding: 16px;
                    background: var(--card-bg);
                    border-bottom: 1px solid var(--border-color);
                    display: grid;
                    gap: 16px;
                    animation: slideDown 0.3s ease;
                }
                @keyframes slideDown {
                    from { opacity: 0; max-height: 0; }
                    to { opacity: 1; max-height: 500px; }
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .filter-group label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                }
                .filter-group select {
                    padding: 10px 12px;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .filter-group select:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                }
                .filter-checkboxes {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                .checkbox-label input {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
                .emergency-text {
                    color: var(--danger);
                    font-weight: 600;
                }
                .nearme-text {
                    color: var(--brand-primary);
                    font-weight: 600;
                }
                .search-content {
                    padding: 16px;
                }
                .search-results-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .search-history-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .search-history-header h3 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .clear-history-btn {
                    all: unset;
                    cursor: pointer;
                    font-size: 0.875rem;
                    color: var(--brand-primary);
                    font-weight: 500;
                }
                .search-history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 24px;
                }
                .history-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: background 0.2s;
                }
                .history-item:hover {
                    background: var(--hover-bg);
                }
                .history-item svg {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                .history-item span {
                    flex: 1;
                    color: var(--text-primary);
                }
                .quick-filters h3 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }
                .quick-filter-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .quick-filter-chips button {
                    all: unset;
                    cursor: pointer;
                    padding: 10px 16px;
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    transition: all 0.2s;
                }
                .quick-filter-chips button:hover {
                    border-color: var(--brand-primary);
                    background: var(--hover-bg);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}


/* -------- Notifications Section -------- */
function NotificationsSection() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { user } = useAuth();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();
            // Handle both array and object responses
            const notificationsArray = Array.isArray(data) ? data : (data?.notifications || []);
            setNotifications(notificationsArray);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.read);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <section className="section">
            <div className="notifications-header">
                <h2>Notifications</h2>
                {unreadCount > 0 && (
                    <button className="mark-all-btn" onClick={markAllAsRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifications-filter">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Unread {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading notifications...
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </div>
            ) : (
                <div className="notifications-list">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                            onClick={() => !notification.read && markAsRead(notification._id)}
                        >
                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!notification.read && <div className="unread-dot"></div>}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .notifications-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .notifications-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.3;
                }
                .mark-all-btn {
                    all: unset;
                    cursor: pointer;
                    font-size: 0.875rem;
                    color: var(--brand-primary);
                    font-weight: 600;
                    padding: 8px 16px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .mark-all-btn:hover {
                    background: var(--hover-bg);
                }
                .notifications-filter {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .filter-btn {
                    all: unset;
                    cursor: pointer;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    background: var(--card-bg);
                    border: 1.5px solid var(--border-color);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: var(--shadow-sm);
                }
                .filter-btn:hover {
                    border-color: var(--border-hover);
                    background: var(--hover-bg);
                }
                .filter-btn.active {
                    background: rgba(17, 24, 39, 0.05);
                    color: var(--brand-primary);
                    border-color: var(--brand-primary);
                    border-width: 2px;
                }
                [data-theme='dark'] .filter-btn.active {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--brand-primary);
                    border-color: var(--brand-primary);
                    border-width: 2px;
                }
                .unread-badge {
                    background: var(--danger);
                    color: white;
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 700;
                }
                .notifications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .notification-item {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .notification-item:hover {
                    border-color: var(--border-hover);
                    box-shadow: var(--shadow-md);
                }
                .notification-item.unread {
                    background: rgba(17, 24, 39, 0.02);
                    border-color: var(--brand-primary);
                }
                [data-theme='dark'] .notification-item.unread {
                    background: rgba(255, 255, 255, 0.02);
                }
                .notification-content h4 {
                    margin: 0 0 8px 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .notification-content p {
                    margin: 0 0 8px 0;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }
                .notification-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .unread-dot {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 10px;
                    height: 10px;
                    background: var(--brand-primary);
                    border-radius: 50%;
                }
            `}</style>
        </section>
    );
}
/* -------- About -------- */
function AboutSection() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "How do I report an issue?",
            a: "Click on 'New Complaint' in the sidebar, capture a photo using your camera (which automatically records location), select a category, add a description, and submit. Your report will be visible to authorities and other citizens."
        },
        {
            q: "Why does the app need camera and location permissions?",
            a: "Camera permission is needed to capture evidence of the issue. Location permission ensures accurate geotagging so authorities know exactly where the problem is. Without these permissions, you won't be able to submit reports."
        },
        {
            q: "What happens after I submit a complaint?",
            a: "Your complaint goes into 'Pending' status. Authorities review it, update the status (Under Review → In Progress → Resolved), and you'll receive notifications at each stage. You can track progress in your profile."
        },
        {
            q: "How does the badge system work?",
            a: "You earn badges for various activities: First Report (1st complaint), Top Contributor (10+ complaints), Helpful (50+ likes received), and more. Badges are displayed on your profile and next to your name on posts."
        },
        {
            q: "What is an emergency escalation?",
            a: "If you encounter a dangerous situation (road collapse, live wires, etc.), you can mark your report as 'Emergency'. This prioritizes it for immediate attention by authorities. Use responsibly - false emergencies may result in penalties."
        },
        {
            q: "How are views counted?",
            a: "Each logged-in user's view counts once per report. If you're not logged in, each visit counts separately. View count helps identify high-visibility issues that affect many people."
        },
        {
            q: "Can I delete my complaint?",
            a: "Yes, go to your Profile, find the complaint, and click the delete button. Note: Only unresolved complaints can be deleted. Resolved issues are kept for transparency and record-keeping."
        },
        {
            q: "Is my data secure?",
            a: "Yes. Your password is encrypted, photos are stored securely in the cloud, and we don't share personal information with third parties. Location data is only used for geotagging reports."
        }
    ];

    return (
        <section className="section">
            {/* App Description */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>About CivicWorks</h2>

                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <strong>CivicWorks</strong> is a modern civic issue tracking platform that bridges the gap between citizens and local authorities.
                    Our mission is to make reporting infrastructure problems as simple as taking a photo.
                </p>

                <div style={{
                    background: 'var(--hover-bg)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>✨ Key Features</h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'grid',
                        gap: '8px'
                    }}>
                        <li>📸 <strong>Camera Capture</strong> - Take photos directly with automatic GPS tagging</li>
                        <li>📍 <strong>Location Tracking</strong> - Precise coordinates for accurate issue placement</li>
                        <li>🔔 <strong>Real-time Notifications</strong> - Get updates on your complaints</li>
                        <li>🏆 <strong>Badge System</strong> - Earn rewards for active participation</li>
                        <li>🚨 <strong>Emergency Escalation</strong> - Prioritize critical safety issues</li>
                        <li>🗺️ <strong>Interactive Map</strong> - View issues near your location</li>
                        <li>🔍 <strong>Search & Filter</strong> - Find specific complaints easily</li>
                        <li>👍 <strong>Community Engagement</strong> - Like, comment, and track issues</li>
                    </ul>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--success)' }}>
                        🌱 How It Works
                    </h3>
                    <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
                        <li><strong>Report</strong> - Capture photo + location of the issue</li>
                        <li><strong>Submit</strong> - Add category, description, and priority</li>
                        <li><strong>Track</strong> - Monitor status updates from authorities</li>
                        <li><strong>Resolve</strong> - See before/after when issue is fixed</li>
                    </ol>
                </div>
            </div>

            {/* FAQ Section */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>❓ Frequently Asked Questions</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                overflow: 'hidden'
                            }}
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                style={{
                                    all: 'unset',
                                    width: '100%',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: 'var(--text-primary)',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <span>{faq.q}</span>
                                <span style={{
                                    fontSize: '1.25rem',
                                    transition: 'transform 0.2s',
                                    transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0)'
                                }}>
                                    ▼
                                </span>
                            </button>
                            {expandedFaq === index && (
                                <div style={{
                                    padding: '0 20px 16px 20px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    borderTop: '1px solid var(--border-color)',
                                    paddingTop: '16px'
                                }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Developer Card */}
            <div style={{
                marginTop: '3rem',
                padding: '24px',
                background: 'linear-gradient(135deg, var(--card-bg), var(--bg-tertiary))',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                maxWidth: '650px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--brand-primary)',
                    color: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '0 auto 16px auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    S
                </div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700 }}>Saksham</h3>
                <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Full Stack Developer
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <a href="https://github.com/SIFLE69" target="_blank" rel="noopener noreferrer" className="brand-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/saksham-saini-b0542125a" target="_blank" rel="noopener noreferrer" className="brand-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        LinkedIn
                    </a>
                </div>
            </div>
        </section>
    );
}
