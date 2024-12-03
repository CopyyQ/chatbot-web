import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatbotId, setChatbotId] = useState(1); // Default Gemini
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const chatHistoryRef = useRef(null); // To scroll to bottom when a new message is added

  // Load chat history and chatbotId from localStorage
  useEffect(() => {
    const savedChatHistory = localStorage.getItem('chatHistory');
    const savedChatbotId = localStorage.getItem('chatbotId');

    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }

    if (savedChatbotId) {
      const parsedChatbotId = parseInt(savedChatbotId, 10);
      if (chatbotId !== parsedChatbotId) {
        setChatbotId(parsedChatbotId);
      }
    }
  }, []);

  // Scroll to the latest message when chat history changes
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    localStorage.setItem('chatbotId', chatbotId);
  }, [chatHistory, chatbotId]);

  const handleMessageSubmit = async () => {
    if (loading || !message.trim()) return;
    setLoading(true);

    let apiUrl = 'https://c87b-34-125-156-8.ngrok-free.app'; // ngrok URL

    if (chatbotId === 1) {
      apiUrl += '/gemini';
    } else if (chatbotId === 2) {
      apiUrl += '/medical';
    } else if (chatbotId === 3) {
      apiUrl += '/text_to_image';
      setIsGeneratingImage(true);
    }

    try {
      const response = await axios.post(apiUrl, {
        question: message,
        ...(chatbotId === 3 && { prompt: message }), // for image generation
      }, {
        responseType: chatbotId === 3 ? 'blob' : 'json', // Handling blob for image
      });

      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: 'user', text: message },
        {
          type: 'bot',
          text: chatbotId === 3 ? URL.createObjectURL(response.data) : formatText(response.data.answer || "No answer received."),
          isImage: chatbotId === 3,
        },
      ]);
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: 'bot', text: "Sorry, there was an error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
      setIsGeneratingImage(false);
    }
  };

  // Format the text for special markdown
  const formatText = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return text;
  };

  // Reset chat history
  const resetChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatbotId');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (id) => {
    setChatbotId(id);
    resetChatHistory();
    setDropdownOpen(false);
  };

  const getChatbotName = (id) => {
    switch (id) {
      case 1: return "Gemini";
      case 2: return "Medical Bot";
      case 3: return "Text to Image";
      default: return "Gemini";
    }
  };

  // Add onKeyPress to send message on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior (new line in textarea)
      handleMessageSubmit(); // Send the message
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <h3>{getChatbotName(chatbotId)}</h3>
          <div className="model-selector">
            <div className="custom-select" onClick={toggleDropdown}>
              {getChatbotName(chatbotId)}
            </div>
            <div className={`select-options ${isDropdownOpen ? 'active' : ''}`}>
              {chatbotId !== 1 && (
                <div className="select-option" onClick={() => handleOptionSelect(1)}>Gemini</div>
              )}
              {chatbotId !== 2 && (
                <div className="select-option" onClick={() => handleOptionSelect(2)}>Medical Bot</div>
              )}
              {chatbotId !== 3 && (
                <div className="select-option" onClick={() => handleOptionSelect(3)}>Text to Image</div>
              )}
            </div>
          </div>
        </div>

        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.type === 'bot' && msg.isImage ? (
                <img src={msg.text} alt="Bot response" className="bot-image" />
              ) : (
                <p className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }} />
              )}
            </div>
          ))}
          {isGeneratingImage && (
            <div className="chat-message bot">
              <p className="message-text">Generating image... Please wait.</p>
            </div>
          )}
        </div>

        <div className="input-section">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            className="form-control"
            placeholder="Type your question..."
          />
          <button onClick={handleMessageSubmit} className="btn btn-primary" disabled={loading}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
