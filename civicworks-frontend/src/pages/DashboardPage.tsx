import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getReports, createReportMultipart } from "../lib/api";
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

type TabKey = "feed" | "complaint" | "nearby" | "profile" | "about";

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
    const [tab, setTab] = useState<TabKey>("feed");
    const [reports, setReports] = useState<Report[]>([]);
    const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("theme") as "light" | "dark") || "light");
    const [justSubmittedAt, setJustSubmittedAt] = useState<number>(0); // for pulsing new marker
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
                        <div className="brand-logo">CW</div>
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
                    {tab !== 'feed' && (
                        <button className="back-btn" onClick={() => setTab('feed')} title="Back to feed">
                            ← Back
                        </button>
                    )}
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Dashboard</div>
                    <div className="row" style={{ gap: '12px' }}>
                        <NotificationBell />
                        <button className="secondary" onClick={load}>Refresh</button>
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
            </main>
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
            {/* Search and Filter */}
            {onFilter && (
                <SearchFilter
                    onFilter={(filters) => {
                        onFilter(filters);
                    }}
                />
            )}

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

            {/* Tip */}
            <div style={{
                marginTop: '2rem',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(245, 158, 11, 0.1))',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: 'var(--warning)'
            }}>
                💡 <strong>Tip:</strong> Allow camera and location permissions for the best experience.
                Without these, you won't be able to submit new complaints.
            </div>
        </section>
    );
}
