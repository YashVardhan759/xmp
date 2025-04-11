// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to LearnSphere</h1>
        <p>Your personal learning assistant for exploring any subject, concept, or idea.</p>
        <div className="cta-buttons">
          <Link to="/chat" className="btn primary">Start Learning</Link>
          <Link to="/history" className="btn secondary">View Past Sessions</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>How LearnSphere Helps You Learn</h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Interactive Learning</h3>
            <p>Engage in natural conversations to explore concepts deeply and get personalized explanations.</p>
          </div>
          
          <div className="feature-card">
            <h3>Save Your Progress</h3>
            <p>Automatically save your learning sessions to continue where you left off or revisit important concepts.</p>
          </div>
          
          <div className="feature-card">
            <h3>Organized Knowledge</h3>
            <p>Access and manage your past learning sessions to build a comprehensive personal knowledge base.</p>
          </div>
        </div>
      </div>
      
      <div className="topic-section">
        <h2>Explore Popular Topics</h2>
        <div className="topic-pills">
          <Link to="/chat" className="topic-pill">Mathematics</Link>
          <Link to="/chat" className="topic-pill">Computer Science</Link>
          <Link to="/chat" className="topic-pill">Physics</Link>
          <Link to="/chat" className="topic-pill">Biology</Link>
          <Link to="/chat" className="topic-pill">History</Link>
          <Link to="/chat" className="topic-pill">Literature</Link>
          <Link to="/chat" className="topic-pill">Philosophy</Link>
          <Link to="/chat" className="topic-pill">Economics</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;