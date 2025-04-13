import React from 'react';
import { FaEnvelope, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useMessages } from '../../context/MessagesContext';
import AdminLayout from '../../components/Layout/AdminLayout';
import './Admin.css';

const MessagesManager = () => {
  const { messages, markAsRead, deleteMessage } = useMessages();

  const handleMarkAsRead = (messageId) => {
    markAsRead(messageId);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="admin-messages">
        <div className="admin-header">
          <h1>Messages</h1>
          <div className="messages-count">
            <span>{messages.filter(m => !m.read).length} unread</span>
            <span>{messages.length} total</span>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <FaEnvelope />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (                <div 
                  key={message._id} 
                  className={`message-card ${!message.read ? 'unread' : ''}`}
                >
                  <div className="message-header">
                    <h3>{message.name}</h3>
                    <span className="message-time">{formatDate(message.timestamp)}</span>
                  </div>
                  <div className="message-content">
                    <p><strong>Email:</strong> {message.email}</p>
                    <p className="message-text">{message.message}</p>
                  </div>
                  <div className="message-actions">
                    {!message.read && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        <FaCheckCircle /> Mark as Read
                      </button>
                    )}                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default MessagesManager;
