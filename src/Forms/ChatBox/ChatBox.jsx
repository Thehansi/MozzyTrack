/*
import React, { useState, useEffect } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import "./ChatBoxStyle.css"; // Import CSS file

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(savedMessages);
  }, []);

  // Save messages to localStorage whenever messages update
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (newMessage || selectedImage) {
      const newChat = { user: "You", text: newMessage, image: selectedImage };

      setMessages([...messages, newChat]);
      setNewMessage("");
      setSelectedImage(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Store image as Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
  };

  return (
    <div className='chat-container'>
      <div className='chat-box'>
        {messages.map((msg, index) => (
          <div key={index} className='message-container'>
            <div className='message'>
              <strong>{msg.user}: </strong>
              {msg.text && <span>{msg.text}</span>}
              {msg.image && (
                <img src={msg.image} alt='Uploaded' className='chat-image' />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='input-container'>
        <TextBox
          className='text-input'
          value={newMessage}
          onValueChanged={(e) => setNewMessage(e.value)}
          placeholder='Type a message...'
        />
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='file-input'
          id='file-upload'
        />
        <label htmlFor='file-upload' className='upload-btn'>
          📷 Upload
        </label>
        <Button
          text='Send'
          onClick={sendMessage}
          disabled={!newMessage && !selectedImage}
          className='send-btn'
        />
        <Button text='Clear Chat' onClick={clearChat} className='clear-btn' />
      </div>
    </div>
  );
};

export default ChatBox;*/
import React, { useState, useEffect } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import "./ChatBoxStyle.css"; // Import CSS file

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [username, setUsername] = useState("User1"); // Logged-in user's name (can be dynamic)

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(savedMessages);

    const authData = JSON.parse(localStorage.getItem("user"));
    setUsername(authData.UserName);
  }, []);

  // Save messages to localStorage whenever messages update
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (newMessage || selectedImage) {
      const newChat = {
        user: username,
        text: newMessage,
        image: selectedImage,
      };

      setMessages([...messages, newChat]);
      setNewMessage("");
      setSelectedImage(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Store image as Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
  };

  return (
    <div className='chat-container'>
      <div className='chat-box'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-container ${
              msg.user === username ? "user-message" : "other-message"
            }`}
          >
            <div className='message'>
              <strong>{msg.user === username ? "You" : msg.user}: </strong>
              {msg.text && <span>{msg.text}</span>}
              {msg.image && (
                <img src={msg.image} alt='Uploaded' className='chat-image' />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='input-container'>
        <TextBox
          className='text-input'
          value={newMessage}
          onValueChanged={(e) => setNewMessage(e.value)}
          placeholder='Type a message...'
        />
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='file-input'
          id='file-upload'
        />
        <label htmlFor='file-upload' className='upload-btn'>
          📷 Upload
        </label>
        <Button
          text='Send'
          onClick={sendMessage}
          disabled={!newMessage && !selectedImage}
          className='send-btn'
        />
        <Button text='Clear Chat' onClick={clearChat} className='clear-btn' />
      </div>
    </div>
  );
};

export default ChatBox;
