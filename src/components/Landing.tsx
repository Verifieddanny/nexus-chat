import React from 'react';
import { Chat01Icon, Shield01Icon, ZapIcon, UserGroupIcon, ArrowRight01Icon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import './styles/Landing.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">
            <Chat01Icon size={24} color="white" />
          </div>
          <span>NexusChat</span>
        </div>
        <button className="outline-btn" onClick={() => navigate('/login')}>
          Sign In
        </button>
      </nav>

      <header className="hero-section">
        <div className="badge">
           Real-time messaging at light speed
        </div>
        <h1 className="hero-title">
          Connect with anyone, <span className="text-blue">anywhere</span> instantly.
        </h1>
        <p className="hero-subtitle">
          Experience a new level of real-time communication. NexusChat brings you seamless messaging, 
          typing indicators, and presence detection in one beautiful interface.
        </p>
        <div className="hero-actions">
          <button className="primary-btn-large" onClick={() => navigate('/login')}>
            Get Started for Free <ArrowRight01Icon size={20} />
          </button>
        </div>
      </header>

      <section className="features-container">
        <div className="features-grid">
          <FeatureCard 
            icon={<ZapIcon size={32} color="#3b82f6" />}
            title="Real-Time"
            description="Built with Socket.io for instant message delivery and live typing indicators."
          />
          <FeatureCard 
            icon={<Shield01Icon size={32} color="#3b82f6" />}
            title="Secure"
            description="JWT authentication and bcrypt password hashing to keep your data protected."
          />
          <FeatureCard 
            icon={<UserGroupIcon size={32} color="#3b82f6" />}
            title="Groups & DMs"
            description="Easily create private rooms for one-on-one chats or large groups."
          />
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 NexusChat API Integration. Built for engineering mastery.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);