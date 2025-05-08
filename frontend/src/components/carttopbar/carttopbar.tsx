import React from 'react';
import './carttopbar.css';
import logobar from "../../assets/shoppobar.png"

const Carttopbar: React.FC = () => {
  return (
    <nav className="navbarcart">
      <div className="navbar-logo">
      <img src={logobar} alt="Shoppoo logobar" />
      <input type="text" className="search-barcart" placeholder="Search for products" />
      </div>
      <div className="navbar-rightcart">
        <a href="/help" className="navbar-help-center">Help Center</a>
      </div>
    </nav>
  );
}

export default Carttopbar;
