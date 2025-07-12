import React, { useState, useEffect } from "react";
import { FaEnvelope, FaTimes } from "react-icons/fa";

const ChatBotNotification = ({ onOpenChat }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate receiving new messages
    const timer = setTimeout(() => {
      setNotifications([
        {
          id: 1,
          message: "Chào bạn! Có gì tôi có thể giúp được?",
          time: new Date(),
        },
      ]);
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setNotifications([]);
  };

  const handleOpenChat = () => {
    onOpenChat();
    handleDismiss();
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gradient-to-r from-[#1f1f1f] to-[#2b2b2b] text-white p-4 rounded-xl shadow-2xl border border-gray-600 mb-2 animate-fade-in-up"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-2">
              <div className="flex items-center space-x-2 mb-2">
                <FaEnvelope className="text-[#BE1238] text-sm" />
                <span className="text-sm font-semibold text-[#BE1238]">
                  Neko Assistant
                </span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {notification.message}
              </p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleOpenChat}
                  className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] text-white text-xs px-3 py-1 rounded-lg hover:shadow-lg transition-all"
                >
                  Trả lời
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-gray-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBotNotification;
