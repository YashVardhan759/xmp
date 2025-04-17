// src/components/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ChatList() {
  const [savedChats, setSavedChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedSessions();
  }, []);

  const loadSavedSessions = () => {
    try {
      const chats = JSON.parse(localStorage.getItem('learnSessions') || '{}');
      
      // Convert object to array and sort by date
      const chatArray = Object.values(chats).sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      
      setSavedChats(chatArray);
    } catch (e) {
      console.error('Error loading saved sessions:', e);
      setSavedChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const chats = JSON.parse(localStorage.getItem('learnSessions') || '{}');
      delete chats[id];
      localStorage.setItem('learnSessions', JSON.stringify(chats));
      
      // Update the UI
      loadSavedSessions();
    } catch (e) {
      console.error('Error deleting session:', e);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="learning-history">
      <div className="history-header">
        <h1>Learning History</h1>
        <Link to="/chat" className="btn primary">New Exploration</Link>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading saved sessions...</div>
      ) : savedChats.length === 0 ? (
        <div className="empty-history">
          <p>You don't have any saved learning sessions yet.</p>
          <p>Start a <Link to="/chat">new exploration</Link> to begin learning.</p>
        </div>
      ) : (
        <div className="session-list">
          {savedChats.map((chat) => (
            <Link to={`/chat/${chat.id}`} key={chat.id} className="session-card">
              <div className="session-title">
                <span>{chat.title}</span>
                <button onClick={(e) => deleteSession(chat.id, e)} className="delete-session-btn" title="Delete this session">
                 &#x1F5D1;
                </button>
              </div>
              <div className="session-details">
                <span className="session-date">Last updated: {formatDate(chat.updatedAt)}</span>
                <span className="session-exchanges">
                  {chat.session.length} exchanges
                </span>
              </div>
              
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;