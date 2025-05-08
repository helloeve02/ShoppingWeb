import React from 'react';
import './topbarhome.css';
import logobar from "../../assets/shoppobar.png"

const Topbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <img src={logobar} alt="Shoppoo logobar" />
        {/* <h1>SHOPPOO | </h1> */}
      </div>
      <div className="navbar-right">
        <a href="/help" className="navbar-help-center">Help Center</a>
        <a href="/home" className="navbar-home">Home</a>
      </div>
    </nav>
  );
}

export default Topbar;
