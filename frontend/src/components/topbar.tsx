import React from 'react';
import './topbar.css';
import logobar from "../assets/shoppobar.png"

const Topbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logobar} alt="Shoppoo logobar" />
        {/* <h1>SHOPPOO | </h1> */}
      </div>
    </nav>
  );
}

export default Topbar;
