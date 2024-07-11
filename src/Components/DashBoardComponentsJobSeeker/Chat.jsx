import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { type: 'user', content: inputText };
    setChatMessages(prev => [...prev, newMessage]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/chat', { question: inputText });
      console.log('Response:', response.data);
      const botMessage = { type: 'bot', content: response.data.result };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = { type: 'bot', content: 'Error fetching response. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    }

    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <h2>Chat with Bot</h2>
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.content}
            </div>
          ))}
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your question here"
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
