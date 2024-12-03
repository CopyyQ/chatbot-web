import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';  // Chỉ cần dùng import axios một lần ở đầu tệp
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chatItems, setChatItems] = useState([]); // Store list of chats
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatListRef = useRef(null);

  // Địa chỉ API (có thể thay thế bằng URL của bạn)
  const API_URL = 'https://307b-34-48-115-127.ngrok-free.app/get_chats'; 

  // Hàm gọi API để lấy danh sách các chat
  const fetchChats = async () => {
    setLoading(true);  // Đánh dấu bắt đầu tải
    setError(null);  // Reset lỗi nếu có
    try {
      // Gửi yêu cầu GET tới API
      const response = await axios.get(API_URL);
  
      // Kiểm tra trạng thái phản hồi và dữ liệu
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
  
      if (response.data.status === 'success') {
        setChatItems(response.data.chats);  // Set chat items nếu thành công
      } else {
        setError('Failed to load chats');  // Xử lý nếu không có dữ liệu hợp lệ
      }
    } catch (err) {
      setError('Error fetching chats');  // Xử lý lỗi
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);  // Kết thúc quá trình tải
    }
  };

  // Gọi fetchChats khi component được mount
  useEffect(() => {
    fetchChats();
  }, []); // Chỉ gọi một lần khi component mount

  // Xử lý sự kiện cuộn để load thêm chat
  const handleScroll = () => {
    if (chatListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        setVisibleCount((prevCount) => prevCount + 10); // Load thêm 10 chat khi cuộn đến cuối
      }
    }
  };

  return (
    <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
        </button>
      </div>
      <div
        className={`chat-history-list ${isSidebarCollapsed ? 'collapsed' : ''}`}
        ref={chatListRef}
        onScroll={handleScroll}
      >
        {loading && <div>Loading chats...</div>}  {/* Hiển thị loading khi đang tải */}
        {error && <div className="error">{error}</div>}  {/* Hiển thị lỗi nếu có */}
        {chatItems.slice(0, visibleCount).map((chat) => (
          <div key={chat.id} className="chat-item">
            <div className="chat-name">{chat.name}</div> {/* Chỉ hiển thị tên chat */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
