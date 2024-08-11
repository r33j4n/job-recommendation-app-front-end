import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ChatInterface.css';

const ChatInterface = () => {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [details, setDetails] = useState(null);

  const fetchDetails = async (roleId) => {
    try {
      const response = await axios.get(`http://localhost:8081/jobseeker/get/${roleId}`);
      setDetails(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching details:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { type: 'user', content: inputText };
    setChatMessages(prev => [...prev, newMessage]);

    const roleId = localStorage.getItem('roleId');
    let detailsData = details;

    if (!detailsData && roleId) {
      detailsData = await fetchDetails(roleId);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/chat_ui', { question: inputText, details: detailsData });
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
              <ReactMarkdown>{msg.content}</ReactMarkdown>
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