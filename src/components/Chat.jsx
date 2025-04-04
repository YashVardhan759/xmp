import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);
  const [topP, setTopP] = useState(0.95);
  const [maxOutputTokens, setMaxOutputTokens] = useState(2048);
  const [debugInfo, setDebugInfo] = useState(null);
  const [chatSession, setChatSession] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedApiKey = localStorage.getItem('geminiApiKey');
    const savedModel = localStorage.getItem('geminiModel');
    const savedTemperature = localStorage.getItem('geminiTemperature');
    const savedTopK = localStorage.getItem('geminiTopK');
    const savedTopP = localStorage.getItem('geminiTopP');
    const savedMaxOutputTokens = localStorage.getItem('geminiMaxOutputTokens');
    const savedCustomModel = localStorage.getItem('geminiCustomModel');
    const savedUseCustomModel = localStorage.getItem('geminiUseCustomModel');
    const savedChatSession = localStorage.getItem('geminiChatSession');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
    if (savedTemperature) setTemperature(parseFloat(savedTemperature));
    if (savedTopK) setTopK(parseInt(savedTopK));
    if (savedTopP) setTopP(parseFloat(savedTopP));
    if (savedMaxOutputTokens) setMaxOutputTokens(parseInt(savedMaxOutputTokens));
    if (savedCustomModel) setCustomModel(savedCustomModel);
    if (savedUseCustomModel) setUseCustomModel(savedUseCustomModel === 'true');
    if (savedChatSession) {
      try {
        const parsedSession = JSON.parse(savedChatSession);
        setChatSession(parsedSession);
        
        // Also restore visible messages from the chat session
        const visibleMessages = parsedSession.map(msg => ({
          role: msg.role,
          content: msg.parts[0].text
        }));
        setMessages(visibleMessages);
      } catch (e) {
        console.error('Error parsing saved chat session:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save chat session to localStorage whenever it changes
  useEffect(() => {
    if (chatSession.length > 0) {
      localStorage.setItem('geminiChatSession', JSON.stringify(chatSession));
    }
  }, [chatSession]);

  const clearChat = () => {
    setMessages([]);
    setChatSession([]);
    localStorage.removeItem('geminiChatSession');
  };

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
    
    // Add user message to chat session in Gemini format
    const userChatMessage = {
      role: 'user',
      parts: [{ text: input }]
    };
    const updatedChatSession = [...chatSession, userChatMessage];
    setChatSession(updatedChatSession);
    
    setInput('');
    setLoading(true);
    setDebugInfo(null);

    try {
      const modelToUse = useCustomModel && customModel ? customModel : model;
      console.log(`Sending request to Gemini API with model: ${modelToUse}`);
      
      const response = await axios.post('/.netlify/functions/gemini-api', {
        apiKey,
        history: updatedChatSession,
        prompt: input,
        model: modelToUse,
        useCustomModel,
        customModel,
        temperature,
        topK,
        topP,
        maxOutputTokens,
        isChatMode: true
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
        
        // Add AI response to chat session in Gemini format
        const aiChatMessage = {
          role: 'model',
          parts: [{ text: aiContent }]
        };
        setChatSession(prevSession => [...prevSession, aiChatMessage]);
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
      
      // Store detailed error info for debugging
      setDebugInfo({
        type: 'error',
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      // Show error in chat with more details
      const errorMessage = error.response?.data?.apiErrorDetails?.error || 
                          error.response?.data?.error || 
                          error.message;
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: `Error: ${errorMessage}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Custom renderer components for ReactMarkdown
  const renderers = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
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
        <div className="chat-header">
          <h2>Chat with Gemini</h2>
          <button 
            onClick={clearChat} 
            className="btn secondary clear-chat-btn"
            title="Clear conversation"
          >
            Clear Chat
          </button>
        </div>
        
        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-chat">
              <p>Start a new conversation with Gemini.</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-header">
                {msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Gemini' : 'System'}
              </div>
              <div className="message-content">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown 
                    children={msg.content} 
                    remarkPlugins={[remarkGfm]}
                    components={renderers}
                  />
                ) : (
                  msg.content
                )}
              </div>
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
            onKeyDown={(e) => {
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