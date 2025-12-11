import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="brand">
          <img src="/logo.png" alt="CivicWorks" className="brand-logo-img" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <span className="brand-title">CivicWorks</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn-text">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="decorative-blob blob-2"></div>
        <div className="hero-content">
          <div className="badge">Empower Your Community</div>
          <h1>Empowering Citizens, Transforming Communities</h1>
          <p>CivicWorks connects you directly with local authorities. Report infrastructure issues, track real-time resolutions, and collaborate to build a safer, better neighborhood.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary large">
              Report an Issue
            </Link>
            <Link to="/login" className="btn-secondary large">
              View Dashboard
            </Link>
          </div>
          <div className="features-list">
            <div className="feature-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Instant camera-based reporting</span>
            </div>
            <div className="feature-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Precise GPS location tagging</span>
            </div>
            <div className="feature-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Transparent resolution tracking</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-graphic">
            <div className="graphic-bg"></div>
            <div className="graphic-card card-1"></div>
            <div className="graphic-card card-2"></div>
            <div className="graphic-card card-3"></div>
            <div className="graphic-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ef4444' }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="decorative-blob blob-1"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three simple steps to make your city better</p>
        </div>
        <div className="features">
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </div>
            <h3>Snap & Report</h3>
            <p>Capture civic issues instantly with your camera. Location is automatically tagged for precise reporting.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <h3>Real-time Tracking</h3>
            <p>View reported issues on an interactive map and track their status from submission to resolution.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Get Results</h3>
            <p>Authorities review and act on reports. See progress updates and resolution timelines in real-time.</p>
          </div>
        </div>
      </section>

      <section className="community-section">
        <div className="decorative-grid"></div>
        <div className="community-content">
          <h2>Join a Growing Community</h2>
          <p>Be part of a movement of active citizens working together to improve public infrastructure and create better neighborhoods for everyone.</p>
          <div className="community-features">
            <div className="community-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Engage with local community members</span>
            </div>
            <div className="community-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Upvote critical issues for faster resolution</span>
            </div>
            <div className="community-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Comment and collaborate on solutions</span>
            </div>
            <div className="community-item">
              <span className="check-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>Track government response and accountability</span>
            </div>
          </div>
          <Link to="/register" className="btn-primary large">Start Making a Difference</Link>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="decorative-blob blob-3"></div>
        <div className="section-header">
          <h2 style={{ textAlign: 'center' }}>About CivicWorks</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', marginBottom: '4rem' }}>
            CivicWorks is a community-driven platform designed to modernize how citizens interact with local infrastructure.
            Our mission is to create transparent, accountable, and efficient cities by empowering every resident to become a
            guardian of their neighborhood. Through real-time reporting, location tracking, and status updates, we bridge the
            gap between problems and solutions, ensuring that no broken street light or pothole goes unnoticed.
          </p>
        </div>

        <div className="developer-showcase">
          <div className="dev-card-wrapper">
            <div className="dev-card-bg"></div>
            <div className="dev-card">
              <div className="dev-header">
                <span className="dev-badge">Lead Developer</span>
                <div className="dev-avatar">SJ</div>
              </div>
              <h3>Saksham Jasrotia</h3>
              <p className="dev-role">Full Stack Engineer</p>
              <p className="dev-bio">
                Passionate about building digital solutions that solve real-world problems.
                CivicWorks is a testament to the power of open-source technology in fostering civic engagement.
              </p>
              <div className="dev-socials">
                <a href="https://github.com/SIFLE69" target="_blank" rel="noopener noreferrer" className="dev-social-link github">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/saksham-jasrotia-b3a13a369" target="_blank" rel="noopener noreferrer" className="dev-social-link linkedin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href="https://www.instagram.com/saksham_jas" target="_blank" rel="noopener noreferrer" className="dev-social-link instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer" id="contact">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand">
              <img src="/logo.png" alt="CivicWorks" className="brand-logo-img" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <span className="brand-title">CivicWorks</span>
            </div>
            <p>Building better communities together, one report at a time.</p>
            <div className="developer-credit">
              <p>Developed by <strong>Saksham Jasrotia</strong></p>
              <div className="minimal-social-links">
                <a href="https://github.com/SIFLE69" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/saksham-jasrotia-b3a13a369" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href="https://www.instagram.com/saksham_jas" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              </div>
            </div>
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

      <button
        className="scroll-top"
        onClick={scrollTop}
        style={{ display: showScroll ? 'flex' : 'none' }}
        aria-label="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>

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

        /* Hero Section */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 5%;
          min-height: 80vh;
          position: relative;
          overflow: hidden;
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
          opacity: 0.8;
          animation: pulse 3s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          padding: 20px;
          border-radius: 50%;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          background: #f3f4f6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111827;
          margin-bottom: 1.5rem;
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
          text-align: center;
          display: block; /* Override global flex style */
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

          .hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 4%;
            min-height: auto;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-content p {
            font-size: 1rem;
            max-width: 100%;
          }

          .hero-image {
            order: -1;
          }

          .placeholder-graphic {
            height: 300px;
          }

          .features-section {
            padding: 4rem 4%;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .section-header p {
            font-size: 1rem;
          }

          .features {
            gap: 1.5rem;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .feature-card h3 {
            font-size: 1.25rem;
          }

          .icon-wrapper {
            width: 48px;
            height: 48px;
          }

          .community-section {
            padding: 4rem 4%;
          }

          .community-content h2 {
            font-size: 2rem;
          }

          .community-content > p {
            font-size: 1rem;
          }

          .community-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .about-section {
            padding: 4rem 4%;
          }

          .dev-card {
            padding: 1.5rem;
          }

          .dev-card h3 {
            font-size: 1.5rem;
          }

          .dev-avatar {
            width: 48px;
            height: 48px;
            font-size: 1.25rem;
          }

          .footer-content {
            padding: 3rem 4%;
          }

          .btn-text {
            display: none;
          }

          .scroll-top {
            bottom: 1rem;
            right: 1rem;
            width: 45px;
            height: 45px;
          }

          .decorative-blob {
            display: none;
          }

          .floating-shape {
            opacity: 0.2;
          }
        }

        @media (max-width: 480px) {
          .landing-nav {
            padding: 0.75rem 3%;
          }

          .brand-title {
            font-size: 1.125rem;
          }

          .brand img {
            width: 32px;
            height: 32px;
          }

          .btn-primary, .btn-secondary {
            padding: 0.5rem 1rem;
            font-size: 0.813rem;
          }

          .hero {
            padding: 1.5rem 3%;
            gap: 1.5rem;
          }

          .badge {
            font-size: 0.688rem;
            padding: 0.375rem 0.75rem;
            margin-bottom: 1rem;
          }

          .hero-content h1 {
            font-size: 1.75rem;
            line-height: 1.2;
            margin-bottom: 1rem;
          }

          .hero-content p {
            font-size: 0.938rem;
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }

          .hero-actions {
            flex-direction: column;
            gap: 0.75rem;
          }

          .btn-primary.large, .btn-secondary.large {
            width: 100%;
            padding: 0.875rem 1.25rem;
            font-size: 0.938rem;
            justify-content: center;
          }

          .features-list {
            font-size: 0.813rem;
            gap: 0.625rem;
            padding-top: 1.25rem;
          }

          .check-icon {
            width: 20px;
            height: 20px;
          }

          .feature-item {
            gap: 0.5rem;
          }

          .placeholder-graphic {
            height: 250px;
            border-radius: 16px;
          }

          .graphic-icon svg {
            width: 60px;
            height: 60px;
          }

          .features-section {
            padding: 3rem 3%;
          }

          .section-header {
            margin-bottom: 2.5rem;
          }

          .section-header h2 {
            font-size: 1.625rem;
            margin-bottom: 0.75rem;
          }

          .section-header p {
            font-size: 0.938rem;
          }

          .features {
            gap: 1.25rem;
          }

          .feature-card {
            padding: 1.25rem;
          }

          .feature-card h3 {
            font-size: 1.125rem;
            margin-bottom: 0.75rem;
          }

          .feature-card p {
            font-size: 0.875rem;
            line-height: 1.5;
          }

          .icon-wrapper {
            width: 40px;
            height: 40px;
            margin-bottom: 1rem;
          }

          .icon-wrapper svg {
            width: 24px;
            height: 24px;
          }

          .community-section {
            padding: 3rem 3%;
          }

          .community-content h2 {
            font-size: 1.625rem;
            margin-bottom: 1rem;
          }

          .community-content > p {
            font-size: 0.938rem;
            margin-bottom: 2rem;
          }

          .community-features {
            gap: 0.75rem;
            margin-bottom: 2rem;
          }

          .community-item {
            padding: 1rem;
            font-size: 0.875rem;
          }

          .about-section {
            padding: 3rem 3%;
          }

          .about-section .section-header p {
            margin-bottom: 2.5rem;
            font-size: 0.938rem;
            padding: 0 0.5rem;
          }

          .developer-showcase {
            margin-top: 2.5rem;
          }

          .dev-card-wrapper {
            max-width: 100%;
          }

          .dev-card {
            padding: 1.25rem;
          }

          .dev-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 1.25rem;
          }

          .dev-badge {
            font-size: 0.688rem;
            padding: 0.375rem 0.75rem;
            margin-bottom: 0.75rem;
          }

          .dev-avatar {
            width: 40px;
            height: 40px;
            font-size: 1.125rem;
            border-radius: 12px;
          }

          .dev-card h3 {
            font-size: 1.375rem;
            text-align: center;
          }

          .dev-role {
            font-size: 0.875rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .dev-bio {
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .dev-socials {
            justify-content: center;
            gap: 0.75rem;
          }

          .dev-social-link {
            width: 36px;
            height: 36px;
          }

          .dev-social-link svg {
            width: 18px;
            height: 18px;
          }

          .footer-content {
            padding: 2rem 3%;
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-brand {
            text-align: center;
          }

          .footer-brand p {
            max-width: 100%;
            font-size: 0.875rem;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            text-align: center;
          }

          .footer-column h4 {
            font-size: 0.938rem;
          }

          .footer-column a {
            font-size: 0.875rem;
          }

          .developer-credit {
            text-align: center;
          }

          .minimal-social-links {
            justify-content: center;
          }

          .footer-bottom {
            padding: 1.5rem 3%;
          }

          .footer-bottom p {
            font-size: 0.75rem;
          }

          .scroll-top {
            bottom: 0.75rem;
            right: 0.75rem;
            width: 40px;
            height: 40px;
          }

          .scroll-top svg {
            width: 20px;
            height: 20px;
          }

          /* Hide decorative elements on mobile */
          .decorative-blob,
          .floating-shape,
          .hero::before,
          .features-section::before,
          .features-section::after,
          .about-section::before {
            display: none;
          }

          /* Ensure proper stacking and spacing */
          .hero-image {
            margin-bottom: 1rem;
          }

          .landing-page {
            overflow-x: hidden;
          }
        }

        /* Decorative Elements */
        .decorative-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.6;
        }

        .blob-1 {
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: rgba(16, 185, 129, 0.1);
          animation: float 10s ease-in-out infinite;
        }

        .decorative-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(#374151 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.05;
          z-index: 0;
        }

        .features-section, .community-section {
          position: relative;
          overflow: hidden;
        }

        .features, .community-content {
          position: relative;
          z-index: 1;
        }

        /* About Section */
        .about-section {
          padding: 6rem 5%;
          background: #f9fafb;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Footer Updates */
        .developer-credit {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .developer-credit p {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .minimal-social-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .minimal-social-links a {
          color: #9ca3af;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .minimal-social-links a:hover {
          color: #111827;
          transform: translateY(-2px);
        }

        /* Developer Showcase */
        .developer-showcase {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
          perspective: 1000px;
        }

        .dev-card-wrapper {
          position: relative;
          width: 100%;
          max-width: 650px;
        }

        .dev-card-bg {
          position: absolute;
          inset: -10px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 30px;
          filter: blur(20px);
          opacity: 0.7;
          animation: rotate-gradient 10s linear infinite;
          z-index: 0;
        }

        .dev-card {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 1;
          text-align: left;
          transition: transform 0.3s ease;
        }

        .dev-card:hover {
          transform: translateY(-5px) rotateX(2deg);
        }

        .dev-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .dev-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
        }

        .dev-avatar {
          width: 64px;
          height: 64px;
          background: #111827;
          color: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 2px solid white;
        }

        .dev-card h3 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.25rem;
          letter-spacing: -0.025em;
        }

        .dev-role {
          color: #4f46e5;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .dev-bio {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .dev-socials {
          display: flex;
          gap: 1rem;
        }

        .dev-social-link {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .dev-social-link.github { background: #24292e; }
        .dev-social-link.linkedin { background: #0077b5; }
        .dev-social-link.instagram { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }

        .dev-social-link:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .blob-2 {
          top: 10%;
          right: -100px;
          width: 500px;
          height: 500px;
          background: rgba(59, 130, 246, 0.1); /* Blue tint */
          animation: float 12s ease-in-out infinite reverse;
        }

        .blob-3 {
          bottom: -100px;
          right: -50px;
          width: 300px;
          height: 300px;
          background: rgba(245, 158, 11, 0.1); /* Amber tint */
          animation: float 8s ease-in-out infinite 1s;
        }

        .floating-shape {
          position: absolute;
          z-index: 0;
          opacity: 0.4;
        }

        .shape-1 {
          top: 20%;
          left: 5%;
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-radius: 8px;
          animation: spin 20s linear infinite;
        }

        .shape-2 {
          bottom: 15%;
          right: 8%;
          width: 60px;
          height: 60px;
          border: 4px solid #e5e7eb;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        /* Small Decorative Icons */
        .features-section::before,
        .features-section::after,
        .hero::before,
        .about-section::before {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          opacity: 0.15;
          background-size: contain;
          background-repeat: no-repeat;
          z-index: 0;
        }

        .hero::before {
          top: 15%;
          right: 10%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
          animation: float 8s ease-in-out infinite;
        }

        .features-section::before {
          top: 10%;
          right: 5%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='2'%3E%3Cpath d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/%3E%3Ccircle cx='12' cy='13' r='4'/%3E%3C/svg%3E");
          animation: float 10s ease-in-out infinite 1s;
        }

        .features-section::after {
          bottom: 10%;
          left: 5%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='2'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          animation: float 12s ease-in-out infinite 2s;
        }

        .about-section::before {
          top: 20%;
          left: 10%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E");
          animation: float 9s ease-in-out infinite 3s;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rotate-gradient {
          0% { filter: hue-rotate(0deg) blur(20px); }
          100% { filter: hue-rotate(360deg) blur(20px); }
        }

        /* Scroll to Top Button */
        .scroll-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          background: #111827;
          color: white;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
          z-index: 100;
        }

        .scroll-top:hover {
          transform: translateY(-3px);
          background: #374151;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
