function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
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
  const [chatTitle, setChatTitle] = useState("New Learning Module");
  const [inputVisible, setInputVisible] = useState(true);
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
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
    if (savedTemperature) setTemperature(parseFloat(savedTemperature));
    if (savedTopK) setTopK(parseInt(savedTopK));
    if (savedTopP) setTopP(parseFloat(savedTopP));
    if (savedMaxOutputTokens) setMaxOutputTokens(parseInt(savedMaxOutputTokens));
    if (savedCustomModel) setCustomModel(savedCustomModel);
    if (savedUseCustomModel) setUseCustomModel(savedUseCustomModel === 'true');
    
    // Load specific chat if chatId is provided
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId]);

  const loadChat = (id) => {
    try {
      // Get saved chats from localStorage
      const savedChats = JSON.parse(localStorage.getItem('learnSessions') || '{}');
      
      if (savedChats[id]) {
        const selectedChat = savedChats[id];
        setChatTitle(selectedChat.title);
        setChatSession(selectedChat.session);
        
        // Convert the chat session to visible messages with proper formatting
        // Important: Preserving the markdown formatting by not modifying content
        const visibleMessages = selectedChat.session.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.parts[0].text
        }));
        
        setMessages(visibleMessages);
      } else {
        // Handle case where chat doesn't exist
        setChatTitle("New Learning Module");
        setMessages([]);
        setChatSession([]);
      }
    } catch (e) {
      console.error('Error loading chat:', e);
      setMessages([]);
      setChatSession([]);
    }
  };

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save current chat session
  const saveCurrentChat = () => {
    if (chatSession.length === 0) return;
    
    try {
      // Get existing chats
      const savedChats = JSON.parse(localStorage.getItem('learnSessions') || '{}');
      const currentId = chatId || `session-${Date.now()}`;
      
      // Generate a title from first user message if not set
      let title = chatTitle;
      if (title === "New Learning Module" && chatSession.length > 0) {
        const firstMessage = chatSession[0].parts[0].text;
        title = firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '');
      }
      
      // Save current chat exactly as is to preserve formatting
      savedChats[currentId] = {
        id: currentId,
        title: title,
        session: chatSession,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('learnSessions', JSON.stringify(savedChats));
      
      // If it's a new chat, redirect to its specific URL
      if (!chatId) {
        navigate(`/chat/${currentId}`);
      }
      
      return currentId;
    } catch (e) {
      console.error('Error saving chat:', e);
      return null;
    }
  };

  // Auto-save when chat changes
  useEffect(() => {
    if (chatSession.length > 0) {
      saveCurrentChat();
    }
  }, [chatSession]); 

  const createNewChat = () => {
    navigate('/chat');
    setChatTitle("New Learning Module");
    setMessages([]);
    setChatSession([]);
  };

  const handleTitleChange = (e) => {
    setChatTitle(e.target.value);
  };

  const toggleInputVisibility = () => {
    setInputVisible(!inputVisible);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setMessages([...messages, 
        { role: 'user', content: input },
        { role: 'system', content: 'Please set your API key in the Settings page.' }
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
      console.log(`Sending request to API with model: ${modelToUse}`);
      
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

  return (
    <div className="learning-session">
      {!apiKey && (
        <div className="warning">
          <p>API key not set. Please configure your API key to start your learning session.</p>
        </div>
      )}
      
      <div className="learning-workspace">
        <div className="workspace-sidebar">
          <button className="new-session-btn" onClick={createNewChat}>
            Start New Topic
          </button>
          
          <div className="session-info">
            <input
              type="text"
              className="session-title-input"
              value={chatTitle}
              onChange={handleTitleChange}
              placeholder="Topic Title"
            />
            
            <div className="session-meta">
              {messages.length > 0 ? `${messages.length} concept exchanges` : 'No exchanges yet'}
            </div>
          </div>
        </div>

        <div className="learning-content">
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="empty-session">
                <h3>Start a new learning exploration</h3>
                <p>Ask questions, explore concepts, or request explanations on any topic.</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className="qa-item">
                <div className={`qa-label ${msg.role === 'user' ? 'question-label' : 'answer-label'}`}>
                  {msg.role === 'user' ? 'Que:' : msg.role === 'assistant' ? 'Ans:' : 'Note:'}
                </div>
                <div className="qa-content">
                  {msg.role === 'user' ? (
                    <div>{msg.content}</div>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              language={match[1]}
                              style={docco}
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
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="loading-indicator">Processing your query...</div>}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-controls">
            <button 
              className="toggle-input-btn" 
              onClick={toggleInputVisibility}
            >
              {inputVisible ? 'Hide Input' : 'Show Input'}
            </button>
            
            {inputVisible && (
              <div className="input-area">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What would you like to learn about today?"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {debugInfo && (
        <div className="debug-panel">
          <details>
            <summary>API Debug Information</summary>
            <div className="debug-content">
              <pre>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default Chat;