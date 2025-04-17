// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';

function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);
  const [topP, setTopP] = useState(0.95);
  const [maxOutputTokens, setMaxOutputTokens] = useState(2048);
  const [customModel, setCustomModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
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
  }, []);

  const handleSave = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    localStorage.setItem('geminiModel', model);
    localStorage.setItem('geminiTemperature', temperature);
    localStorage.setItem('geminiTopK', topK);
    localStorage.setItem('geminiTopP', topP);
    localStorage.setItem('geminiMaxOutputTokens', maxOutputTokens);
    localStorage.setItem('geminiCustomModel', customModel);
    localStorage.setItem('geminiUseCustomModel', useCustomModel);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="form-group">
        <label htmlFor="apiKey">Gemini API Key</label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
        />
      </div>
      
      <div className="form-group">
        <label>Model Selection</label>
        <div className="custom-model-toggle">
          <label className="switch">
            <input 
              type="checkbox" 
              checked={useCustomModel}
              onChange={(e) => setUseCustomModel(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <span>Use custom model name</span>
        </div>
        
        {useCustomModel ? (
          <input
            type="text"
            value={customModel}
            onChange={(e) => setCustomModel(e.target.value)}
            placeholder="Enter custom model name (e.g., gemini-1.5-pro)"
            className="custom-model-input"
          />
        ) : (
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.0-pro">Gemini 1.0 Pro (Deprecated)</option>
            <option value="gemini-ultra">Gemini Ultra (if available)</option>
          </select>
        )}
      </div>
      
      <div className="advanced-toggle">
        <button 
          type="button" 
          className="btn secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
      </div>
      
      {showAdvanced && (
        <div className="advanced-options">
          <div className="form-group">
            <label htmlFor="temperature">
              Temperature: {temperature}
              <span className="setting-description">
                (Controls randomness: 0.0=deterministic, 1.0=creative)
              </span>
            </label>
            <input
              type="range"
              id="temperature"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <div className="range-labels">
              <span>0.0</span>
              <span>1.0</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="topK">
              Top K: {topK}
              <span className="setting-description">
                (Limits token selection to top K options)
              </span>
            </label>
            <input
              type="range"
              id="topK"
              min="1"
              max="100"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
            />
            <div className="range-labels">
              <span>1</span>
              <span>100</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="topP">
              Top P: {topP}
              <span className="setting-description">
                (Nucleus sampling probability threshold)
              </span>
            </label>
            <input
              type="range"
              id="topP"
              min="0"
              max="1"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
            />
            <div className="range-labels">
              <span>0.0</span>
              <span>1.0</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="maxOutputTokens">
              Max Output Tokens: {maxOutputTokens}
              <span className="setting-description">
                (Maximum length of response)
              </span>
            </label>
            <input
              type="range"
              id="maxOutputTokens"
              min="50"
              max="8192"
              step="50"
              value={maxOutputTokens}
              onChange={(e) => setMaxOutputTokens(parseInt(e.target.value))}
            />
            <div className="range-labels">
              <span>50</span>
              <span>8192</span>
            </div>
          </div>
        </div>
      )}
      
      <button className="btn primary" onClick={handleSave}>
        Save Settings
      </button>
      
      {saved && <div className="success-message">Settings saved successfully!</div>}
    </div>
  );
}

export default Settings;