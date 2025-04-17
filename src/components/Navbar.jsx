// src/components/Navbar.jsx 
import React from 'react'; 
import { Link } from 'react-router-dom'; 
function Navbar() { 
  return ( 
    <nav className="navbar"> 
      <div className="logo">LearnSphere</div> 
      <ul className="nav-links"> 
        <li><Link to="/">Home</Link></li> 
        <li><Link to="/chat">Explore</Link></li> 
        <li><Link to="/history">My Sessions</Link></li> 
        <li><Link to="/settings">Settings</Link></li> 
      </ul> 
    </nav> 
  ); 
} 
export default Navbar;