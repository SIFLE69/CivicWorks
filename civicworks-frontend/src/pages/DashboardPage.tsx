import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getReports, createReportMultipart } from "../lib/api";
import CameraCapture from "../components/CameraCapture";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { FeedPost } from "../components/FeedPost";

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
    user?: { name: string; _id: string };
    likes?: string[];
    dislikes?: string[];
    falseReports?: string[];
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function load() {
        try {
            const data = await getReports();
            setReports(data);
        } catch (e) {
            console.error("Failed to load reports", e);
        }
    }

    // theme apply
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
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
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-logo" />
                    <div>
                        <div className="brand-title">CivicWorks</div>
                        <div style={{ fontSize: 12, opacity: .8 }}>Public Infra Complaints</div>
                    </div>
                </div>

                <div className="nav" role="navigation" aria-label="Primary">
                    <button className={tab === 'feed' ? 'active' : ''} onClick={() => setTab('feed')}>Feed</button>
                    <button className={tab === 'complaint' ? 'active' : ''} onClick={() => setTab('complaint')}>New Complaint</button>
                    <button className={tab === 'nearby' ? 'active' : ''} onClick={() => setTab('nearby')}>Map View</button>
                    <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile</button>
                    <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>About</button>
                </div>

                <div className="theme-switch">
                    <span>Theme:</span>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                </div>

                <div style={{ padding: 16 }}>
                    <p>Welcome, {user?.name}</p>
                    <button className="secondary" onClick={() => { logout(); navigate('/'); }}>Logout</button>
                </div>
            </aside>

            {/* Main */}
            <main className="main">
                <div className="header">
                    <div style={{ fontWeight: 800 }}>Dashboard</div>
                    <div className="row">
                        <button className="secondary" onClick={load}>Refresh</button>
                    </div>
                </div>

                <div className="kpis">
                    <div className="kpi"><h4>All Complaints</h4><div className="v">{reports.length}</div></div>
                    <div className="kpi"><h4>Nearby (5 km)</h4><div className="v">{myPos ? nearby5km.length : "-"}</div></div>
                    <div className="kpi"><h4>Your Location</h4><div className="v">{myPos ? `${myPos.lat.toFixed(4)}, ${myPos.lng.toFixed(4)}` : "Unavailable"}</div></div>
                    <div className="kpi"><h4>Theme</h4><div className="v" style={{ textTransform: 'capitalize' }}>{theme}</div></div>
                </div>

                {tab === "feed" && (
                    <FeedSection
                        reports={reports}
                        onRefresh={load}
                        onViewOnMap={(lat, lng) => {
                            setMyPos({ lat, lng });
                            setTab("nearby");
                        }}
                    />
                )}

                {tab === "complaint" && (
                    <ComplaintSection
                        onSubmitted={async () => {
                            await load();
                            setJustSubmittedAt(Date.now());
                            setTab("feed"); // jump to feed
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
            <h2 id="new-complaint" className="section-title"><span className="badge">New Complaint</span> Camera-only capture</h2>

            <form onSubmit={submit}>
                <div className="row">
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="road">Road</option>
                        <option value="water">Water</option>
                        <option value="sewage">Sewage</option>
                        <option value="streetlight">Streetlight</option>
                        <option value="bridge">Bridge</option>
                        <option value="building">Building</option>
                        <option value="park">Park</option>
                        <option value="other">Other</option>
                    </select>

                    <input className="input" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
                    <input className="input" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
                    <button type="button" className="secondary" onClick={useMyLocation}>Use my location</button>
                </div>

                <div className="row">
                    <input className="input" placeholder="Describe the issue" style={{ flex: 1 }} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="row" style={{ alignItems: "flex-start" }}>
                    <div style={{ display: "grid", gap: 8 }}>
                        <button type="button" className="primary" onClick={openCamera}>Open Camera</button>
                        <div className="helper">{statusMsg || "Click 'Open Camera' to capture. Gallery pick is disabled."}</div>
                    </div>
                    {photoPreview && (
                        <div style={{ maxWidth: 240 }}>
                            <img className="preview" src={photoPreview} alt="Captured" />
                        </div>
                    )}
                    <div style={{ marginLeft: "auto" }}>
                        <button className="primary" type="submit" disabled={busy}>
                            {busy ? "Submitting..." : "Register Complaint"}
                        </button>
                    </div>
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
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <h2 className="section-title">
                        <span className="badge">{myPos ? 'Nearby' : 'All'}</span>
                        {myPos ? ` Complaints within 5 km (${nearby.length})` : ` Complaints (${reports.length})`}
                    </h2>
                    <button className="secondary" onClick={onRefresh}>Refresh</button>
                </div>

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
                                    {r.photos?.[0] && <img src={`http://localhost:4000${r.photos[0]}`} alt="evidence" style={{ maxWidth: 160, marginTop: 6 }} />}
                                    <br /><i>Reported by: {r.user?.name || 'Unknown'}</i>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="section" style={{ marginTop: 12 }}>
                    <h3 className="section-title"><span className="badge">List</span> {myPos ? "Within 5 km" : "All Complaints"}</h3>
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
                                    {r.photos?.[0] && <img src={`http://localhost:4000${r.photos[0]}`} alt="evidence" />}
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
    onViewOnMap
}: {
    reports: Report[];
    onRefresh: () => void;
    onViewOnMap: (lat: number, lng: number) => void;
}) {
    return (
        <section className="section">
            <div className="row" style={{ justifyContent: "space-between" }}>
                <h2 className="section-title">
                    <span className="badge">Feed</span> Community Reports ({reports.length})
                </h2>
                <button className="secondary" onClick={onRefresh}>Refresh</button>
            </div>

            {reports.length === 0 ? (
                <div className="helper" style={{ padding: 48, textAlign: 'center', fontSize: '1.1rem' }}>

/* -------- About -------- */
                    function AboutSection() {
    return (
                    <section className="section">
                        <h2 className="section-title"><span className="badge">About</span> CivicWorks</h2>
                        <p>
                            CivicWorks is a modern civic issue tracker. Capture evidence with your device camera, record your location, and submit the complaint.
                            Authorities can review, link to projects, and publish progress and delay reasons. Sidebar + theming ensure a professional, accessible UX.
                        </p>
                        <p className="helper">Tip: allow camera and location permissions for the best experience.</p>
                    </section>
                    );
}
