import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="brand">
          <div className="brand-logo">🏛️</div>
          <span className="brand-title">CivicWorks</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn-text">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <div className="badge">Empower Your Community</div>
          <h1>Building Better Cities, Together</h1>
          <p>Report civic infrastructure issues with just a photo. Track progress in real-time and collaborate with local authorities to create the neighborhood you deserve.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary large">
              <span className="btn-icon">📸</span>
              Report an Issue
            </Link>
            <Link to="/login" className="btn-secondary large">
              <span className="btn-icon">📊</span>
              View Dashboard
            </Link>
          </div>
          <div className="features-list">
            <div className="feature-item">
              <span className="check-icon">✓</span>
              <span>Camera-based instant reporting</span>
            </div>
            <div className="feature-item">
              <span className="check-icon">✓</span>
              <span>GPS location tagging</span>
            </div>
            <div className="feature-item">
              <span className="check-icon">✓</span>
              <span>Real-time complaint tracking</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-graphic">
            <div className="graphic-bg"></div>
            <div className="graphic-card card-1"></div>
            <div className="graphic-card card-2"></div>
            <div className="graphic-card card-3"></div>
            <div className="graphic-icon">📍</div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three simple steps to make your city better</p>
        </div>
        <div className="features">
          <div className="feature-card">
            <div className="icon">📸</div>
            <h3>Snap & Report</h3>
            <p>Capture civic issues instantly with your camera. Location is automatically tagged for precise reporting</p>
            <div className="feature-arrow">→</div>
          </div>
          <div className="feature-card">
            <div className="icon">📍</div>
            <h3>Real-time Tracking</h3>
            <p>View reported issues on an interactive map and track their status from submission to resolution</p>
            <div className="feature-arrow">→</div>
          </div>
          <div className="feature-card">
            <div className="icon">✅</div>
            <h3>Get Results</h3>
            <p>Authorities review and act on reports. See progress updates and resolution timelines in real-time</p>
          </div>
        </div>
      </section>

      <section className="community-section">
        <div className="community-content">
          <h2>Join a Growing Community</h2>
          <p>Be part of a movement of active citizens working together to improve public infrastructure and create better neighborhoods for everyone.</p>
          <div className="community-features">
            <div className="community-item">
              <span className="check-icon">✓</span>
              <span>Engage with local community members</span>
            </div>
            <div className="community-item">
              <span className="check-icon">✓</span>
              <span>Upvote critical issues for faster resolution</span>
            </div>
            <div className="community-item">
              <span className="check-icon">✓</span>
              <span>Comment and collaborate on solutions</span>
            </div>
            <div className="community-item">
              <span className="check-icon">✓</span>
              <span>Track government response and accountability</span>
            </div>
          </div>
          <Link to="/register" className="btn-primary large">Start Making a Difference</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-logo">🏛️</div>
              <span className="brand-title">CivicWorks</span>
            </div>
            <p>Building better communities together, one report at a time.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link to="/register">Get Started</Link>
              <Link to="/login">Dashboard</Link>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CivicWorks. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .landing-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #1f2937;
          background: #ffffff;
          min-height: 100vh;
        }

        /* Navigation */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 5%;
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-logo {
          font-size: 2rem;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-text {
          color: #6b7280;
          text-decoration: none;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-text:hover {
          color: #111827;
          background: #f3f4f6;
        }

        .btn-primary {
          background: #111827;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          background: #374151;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.3);
        }

        .btn-secondary {
          background: #f9fafb;
          color: #111827;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          border: 2px solid #e5e7eb;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary:hover {
          background: #ffffff;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.1);
        }

        .btn-primary.large, .btn-secondary.large {
          padding: 1.125rem 2rem;
          font-size: 1.05rem;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        /* Hero Section */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          padding: 5rem 5%;
          max-width: 1400px;
          margin: 0 auto;
          align-items: center;
          min-height: calc(100vh - 80px);
        }

        .badge {
          display: inline-block;
          background: #f3f4f6;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .hero-content h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #111827;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 2.5rem;
          line-height: 1.7;
          max-width: 90%;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
          color: #4b5563;
        }

        .check-icon {
          background: #111827;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        /* Hero Graphic */
        .hero-image {
          position: relative;
        }

        .placeholder-graphic {
          position: relative;
          width: 100%;
          height: 500px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .graphic-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(17, 24, 39, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(17, 24, 39, 0.05) 0%, transparent 50%);
        }

        .graphic-card {
          position: absolute;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }

        .card-1 {
          top: 15%;
          left: 10%;
          width: 35%;
          height: 25%;
          animation: float 6s ease-in-out infinite;
        }

        .card-2 {
          top: 45%;
          right: 15%;
          width: 40%;
          height: 30%;
          animation: float 7s ease-in-out infinite 1s;
        }

        .card-3 {
          bottom: 12%;
          left: 15%;
          width: 30%;
          height: 20%;
          animation: float 8s ease-in-out infinite 2s;
        }

        .graphic-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 5rem;
          opacity: 0.3;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
        }

        /* Features Section */
        .features-section {
          background: #f9fafb;
          padding: 6rem 5%;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.75rem;
          color: #111827;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .section-header p {
          font-size: 1.25rem;
          color: #6b7280;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          border: 1px solid #e5e7eb;
          position: relative;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .feature-card .icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: inline-block;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
          font-weight: 700;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.6;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .feature-arrow {
          position: absolute;
          top: 50%;
          right: -1rem;
          font-size: 2rem;
          color: #d1d5db;
          display: none;
        }

        @media (min-width: 1024px) {
          .feature-card:not(:last-child) .feature-arrow {
            display: block;
          }
        }

        /* Community Section */
        .community-section {
          padding: 6rem 5%;
          background: #111827;
          color: white;
        }

        .community-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .community-content h2 {
          font-size: 2.75rem;
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .community-content > p {
          font-size: 1.25rem;
          color: #d1d5db;
          margin-bottom: 3rem;
          line-height: 1.7;
        }

        .community-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
          text-align: left;
        }

        .community-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .community-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .check-icon {
          background: rgba(255, 255, 255, 0.2);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 700;
        }

        /* Footer */
        .landing-footer {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 5%;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
        }

        .footer-brand p {
          color: #6b7280;
          margin-top: 1rem;
          max-width: 400px;
          line-height: 1.6;
        }

        .footer-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .footer-column h4 {
          color: #111827;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-column a {
          display: block;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 0.75rem;
          transition: color 0.2s;
        }

        .footer-column a:hover {
          color: #111827;
        }

        .footer-bottom {
          border-top: 1px solid #e5e7eb;
          padding: 2rem 5%;
          text-align: center;
        }

        .footer-bottom p {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 3rem 5%;
          }

          .hero-content h1 {
            font-size: 3rem;
          }

          .hero-image {
            order: -1;
          }

          .placeholder-graphic {
            height: 400px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .landing-nav {
            padding: 1rem 4%;
          }

          .brand-title {
            font-size: 1.25rem;
          }

          .nav-links {
            gap: 0.5rem;
          }

          .btn-primary, .btn-secondary {
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
          }

          .hero {
            padding: 2rem 4%;
            gap: 2rem;
          }

          .hero-content h1 {
            font-size: 2.25rem;
          }

          .hero-content p {
            font-size: 1.125rem;
            max-width: 100%;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .hero-actions .btn-primary,
          .hero-actions .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .badge {
            font-size: 0.75rem;
            padding: 0.375rem 0.875rem;
          }

          .placeholder-graphic {
            height: 300px;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .section-header p {
            font-size: 1.125rem;
          }

          .features-section {
            padding: 4rem 4%;
          }

          .features {
            gap: 1.5rem;
          }

          .feature-card {
            padding: 2rem;
          }

          .community-section {
            padding: 4rem 4%;
          }

          .community-content h2 {
            font-size: 2rem;
          }

          .community-content > p {
            font-size: 1.125rem;
          }

          .community-features {
            grid-template-columns: 1fr;
          }

          .footer-content {
            padding: 3rem 4%;
          }

          .btn-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .btn-primary.large, .btn-secondary.large {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
