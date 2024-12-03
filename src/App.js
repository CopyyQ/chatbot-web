import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar'; // Import Sidebar component
import Chatbot from './components/Chatbot'; // Import Chatbot component
import Header from './components/Header'; // Import Header component

function App() {
  const [collapsed, setCollapsed] = useState(false);  // Quản lý trạng thái collapsed của sidebar

  return (
    <div className="App">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <Header />

        {/* Chatbot Section */}
        <main className="chatbot-container">
          <Chatbot /> {/* Add Chatbot component here */}
        </main>

        {/* Footer */}
        
        <footer className="App-footer">
          <p>© 2024 CopyyQ Chatbot. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
<script defer src="https://app.fastbots.ai/embed.js" data-bot-id="cm489654x11ucsvbmk0rjm00m"></script>