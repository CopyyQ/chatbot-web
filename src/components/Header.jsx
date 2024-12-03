import React from 'react';
import { FaHome, FaUser, FaQuestionCircle } from 'react-icons/fa';  // Import các icon từ react-icons
import '../styles/Header.css'; // Thêm CSS cho Header

const Header = () => {
  return (
    <header className="App-header">
      <div className="header-content">
        <div className="icon-container">
          <FaHome size={24} />
          <FaUser size={24} />
          <FaQuestionCircle size={24} />
        </div>
      </div>
    </header>
  );
};

export default Header;
