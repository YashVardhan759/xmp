// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-pro');
  const [debugInfo, setDebugInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load API key and model from localStorage
    const savedApiKey = localStorage.getItem('geminiApiKey');
    const savedModel = localStorage.getItem('geminiModel');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setMessages([...messages, 
        { role: 'user', content: input },
        { role: 'system', content: 'Please set your Gemini API key in the Settings page.' }
      ]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log('Sending request to Gemini API with model:', model);
      
      const response = await axios.post('/.netlify/functions/gemini-api', {
        apiKey,
        prompt: input,
        model
      });
      
      console.log('API Response:', response.data);
      setDebugInfo({
        type: 'success',
        data: response.data
      });

      // Extract the response text
      if (response.data.candidates && response.data.candidates[0]?.content?.parts) {
        const aiContent = response.data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
      } else {
        // Handle unexpected response format
        setMessages(prev => [
          ...prev, 
          { 
            role: 'system', 
            content: `Received unexpected response format from API. See debug panel for details.`
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Store detailed error info for debugging
      setDebugInfo({
        type: 'error',
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      // Show error in chat
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: `Error: ${error.response?.status || ''} ${error.response?.statusText || ''} - ${error.message}` +
                   `\n\nDetails: ${JSON.stringify(error.response?.data || {})}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">
      {!apiKey && (
        <div className="warning">
          <p>API key not set. Please <Link to="/settings">configure your API key</Link> to start chatting.</p>
        </div>
      )}
      
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="message system">Gemini is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {debugInfo && (
        <div className={`debug-panel ${debugInfo.type}`}>
          <h3>API Debug Information</h3>
          <div className="debug-content">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;