import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="brand">
                    <div className="brand-logo" />
                    <span className="brand-title">CivicWorks</span>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="btn-text">Login</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <header className="hero">
                <div className="hero-content">
                    <h1>Empowering Citizens to Build Better Cities</h1>
                    <p>Report civic issues, track progress, and collaborate with local authorities to improve your neighborhood's infrastructure.</p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary large">Report an Issue</Link>
                        <Link to="/login" className="btn-secondary large">View Dashboard</Link>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Placeholder for a hero illustration or map screenshot */}
                    <div className="placeholder-graphic">
                        <div className="graphic-circle"></div>
                        <div className="graphic-card"></div>
                    </div>
                </div>
            </header>

            <section className="features">
                <div className="feature-card">
                    <div className="icon">📸</div>
                    <h3>Snap & Report</h3>
                    <p>Capture issues instantly with your camera. We automatically tag the location for precise reporting.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">📍</div>
                    <h3>Real-time Tracking</h3>
                    <p>See reported issues on an interactive map and track their status from submission to resolution.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">🤝</div>
                    <h3>Community Driven</h3>
                    <p>Join a community of active citizens working together to maintain and improve public infrastructure.</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} CivicWorks. Building better communities together.</p>
            </footer>

            <style>{`
        .landing-page {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          background: #f8fafc;
          min-height: 100vh;
        }
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
        }
        .hero-content h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-content p {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
        }
        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: white;
          color: #1e293b;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: #f1f5f9;
        }
        .btn-primary.large, .btn-secondary.large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }
        .btn-text {
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
        }
        .btn-text:hover {
          color: #1e293b;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: transform 0.2s;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
        .feature-card .icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }
        .feature-card p {
          color: #64748b;
          line-height: 1.5;
        }
        .landing-footer {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
        }
        
        /* Abstract Graphic */
        .placeholder-graphic {
          position: relative;
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%);
          border-radius: 24px;
          overflow: hidden;
        }
        .graphic-circle {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: rgba(37, 99, 235, 0.1);
          border-radius: 50%;
        }
        .graphic-card {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          top: 100px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-actions {
            justify-content: center;
          }
          .hero-content h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
        </div>
    );
}
