// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Gemini Web Client</h1>
      <p>This application allows you to chat with Google's Gemini AI models using your API key.</p>
      <div className="cta-buttons">
        <Link to="/settings" className="btn primary">Configure API Key</Link>
        <Link to="/chat" className="btn secondary">Start Chatting</Link>
      </div>
    </div>
  );
}

export default Home;