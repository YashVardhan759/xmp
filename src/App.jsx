// src/App.jsx 
import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home'; 
import Chat from './components/Chat'; 
import Settings from './components/Settings'; 
import ChatList from './components/ChatList'; 
import Navbar from './components/Navbar'; 
import './App.css'; 
function App() { 
  return ( 
    <BrowserRouter> 
      <div className="app"> 
        <Navbar /> 
        <main className="content"> 
          <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/chat" element={<Chat />} /> 
            <Route path="/chat/   
            <Route path="/history" element={<ChatList />} /> 
            <Route path="/settings" element={<Settings />} /> 
          </Routes> 
        </main> 
      </div> 
    </BrowserRouter> 
  ); 
} 
export default App;