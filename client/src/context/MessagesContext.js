import React, { createContext, useContext, useState, useEffect } from 'react';

const MessagesContext = createContext();

export const useMessages = () => useContext(MessagesContext);

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prevMessages => [newMessage, ...prevMessages]);
  };

  const markAsRead = (messageId) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId
          ? { ...message, read: true }
          : message
      )
    );
  };

  const deleteMessage = (messageId) => {
    setMessages(prevMessages =>
      prevMessages.filter(message => message.id !== messageId)
    );
  };

  return (
    <MessagesContext.Provider value={{
      messages,
      addMessage,
      markAsRead,
      deleteMessage
    }}>
      {children}
    </MessagesContext.Provider>
  );
};
