import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Send, Smile, Paperclip, ChevronLeft, Info, X } from 'lucide-react';
import './App.css';

function App() {
    const [selectedContact, setSelectedContact] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [contacts, setContacts] = useState([
        { id: 'nr', name: 'Nikhil Raj', status: 'Online', lastMessage: "I've sent you the latest project f ...", time: '12:45 PM', avatar: 'NR' },
        { id: 'sb', name: 'Sruti Bajpayi', status: 'Offline', lastMessage: "Are we still meeting for coffee to ...", time: '08:13 AM', avatar: 'SB' },
        { id: 'nraj', name: 'Nishant Raj', status: 'Online', lastMessage: "The design team loved your pre...", time: 'Yesterday', avatar: 'NR' },
        { id: 's', name: 'Suprit', status: 'Offline', lastMessage: "Can you review the budget prop ...", time: 'Tuesday', avatar: 'S' },
        { id: 'mt', name: 'Mayank Tiwari', status: 'Online', lastMessage: "Thanks for your help with the cli ...", time: 'Monday', avatar: 'MT' },
        { id: 'dm', name: 'District Magistrate', status: 'Offline', lastMessage: "Let's schedule a call to discusst ...", time: 'May 25', avatar: 'DM' },
    ]);

    const [allMessages, setAllMessages] = useState({
        'nr': [
            { id: 1, sender: 'Nikhil Raj', text: "Hey Nikhil! I've sent you the latest project files. Let me know if you need anything else.", time: '12:00 PM', type: 'received' },
            { id: 2, sender: 'You', text: "Got it, thanks! I'll review them before our lunch. See you soon!", time: '12:05 PM', type: 'sent' },
            { id: 3, sender: 'Nikhil Raj', text: "Sounds good! Looking forward to it.", time: '12:15 PM', type: 'received' },
        ],
        'sb': [
            { id: 1, sender: 'Sruti Bajpayi', text: "Are we still meeting for coffee tomorrow morning?", time: '08:13 AM', type: 'received' },
            { id: 2, sender: 'You', text: "Yes, I'm free at 10 AM. Does that work for you?", time: '08:23 AM', type: 'sent' },
            { id: 3, sender: 'Sruti Bajpayi', text: "Perfect! See you then.", time: '08:25 AM', type: 'received' },
        ],
        'nraj': [
            { id: 1, sender: 'Nishant Raj', text: "The design team loved your presentation! Great job!", time: 'Yesterday', type: 'received' },
            { id: 2, sender: 'You', text: "That's great to hear! I'm glad they found it useful.", time: 'Yesterday', type: 'sent' },
        ],
        's': [
            { id: 1, sender: 'Suprit', text: "Can you review the budget proposal by end of day?", time: 'Tuesday', type: 'received' },
            { id: 2, sender: 'You', text: "I'll take a look as soon as I can. Aiming for late afternoon.", time: 'Tuesday', type: 'sent' },
        ],
        'mt': [
            { id: 1, sender: 'Mayank Tiwari', text: "Thanks for your help with the client report!", time: 'Monday', type: 'received' },
            { id: 2, sender: 'You', text: "No problem at all! Happy to help.", time: 'Monday', type: 'sent' },
        ],
        'dm': [
            { id: 1, sender: 'District Magistrate', text: "Let's schedule a call to discuss the new project details.", time: 'May 25', type: 'received' },
            { id: 2, sender: 'You', text: "Sounds good! When are you available next week for a quick chat?", time: 'May 25', type: 'sent' },
        ],
    });

    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showInfoModal, setShowInfoModal] = useState(false);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (filteredContacts.length > 0 && !selectedContact) {
            setSelectedContact(filteredContacts[0]);
        } else if (filteredContacts.length === 0 && selectedContact) {
            setSelectedContact(null);
        } else if (selectedContact && !filteredContacts.some(c => c.id === selectedContact.id)) {
            setSelectedContact(filteredContacts[0] || null);
        }
    }, [filteredContacts, selectedContact]);


    const handleSendMessage = (messageContent) => {
        if (!selectedContact) return;

        let newMessage;
        if (typeof messageContent === 'string' && messageContent.trim() !== '') {
            newMessage = {
                id: (allMessages[selectedContact.id]?.length || 0) + 1,
                sender: 'You',
                text: messageContent,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                type: 'sent',
            };
        } else if (typeof messageContent === 'object' && messageContent.type === 'image' && messageContent.src) {
            newMessage = {
                id: (allMessages[selectedContact.id]?.length || 0) + 1,
                sender: 'You',
                src: messageContent.src,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                type: 'image',
            };
        } else {
            return;
        }

        const currentMessages = allMessages[selectedContact.id] || [];
        const updatedMessagesAfterSend = [...currentMessages, newMessage];

        setAllMessages(prev => ({
            ...prev,
            [selectedContact.id]: updatedMessagesAfterSend,
        }));

        if (newMessage.type === 'sent') {
            setTimeout(() => {
                const botReplies = [
                    "Understood!", "Got it!", "Okay, thanks!", "Sounds good!",
                    "Roger that!", "Will do!", "Interesting point.", "Let me look into that.",
                    "I'll get back to you shortly.", "Acknowledged.", "Affirmative.", "Consider it done.",
                ];
                const botReply = botReplies[Math.floor(Math.random() * botReplies.length)];

                const updatedMessagesAfterReply = [...updatedMessagesAfterSend, {
                    id: updatedMessagesAfterSend.length + 1,
                    sender: selectedContact.name,
                    text: botReply,
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    type: 'received',
                }];

                setAllMessages(prev => ({
                    ...prev,
                    [selectedContact.id]: updatedMessagesAfterReply,
                }));
            }, 1000);
        }
    };

    return (
        <div className="chat-app-container">
            {/* Navbar */}
            <nav className={`navbar ${showSearchInput ? 'search-active' : ''}`}>
                <div className="navbar-left">
                    <button
                        className="navbar-menu-button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="navbar-icon" />
                    </button>
                    <img src="https://img.icons8.com/?size=100&id=UIL5ogsYIbpU&format=png&color=000000" alt="Logo" className="navbar-logo" />
                    <span className="navbar-title">Chat App</span>
                </div>
                <div className="navbar-right">
                    {showSearchInput ? (
                        <div className="search-input-container">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="search-input-field"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                className="navbar-icon-button clear-search-button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setShowSearchInput(false);
                                }}
                            >
                                <X className="navbar-icon" />
                            </button>
                        </div>
                    ) : (
                        <>
                            {selectedContact && (
                                // This span should be hidden on mobile when not in search
                                <span className="navbar-contact-name-mobile-header">
                                    {selectedContact.name}
                                </span>
                            )}
                            <button
                                className="navbar-icon-button"
                                onClick={() => setShowSearchInput(true)}
                                title="Search Contacts"
                            >
                                <Search className="navbar-icon" />
                            </button>
                            <button
                                className="navbar-icon-button"
                                onClick={() => setShowInfoModal(true)}
                                title="App Info"
                            >
                                <Info className="navbar-icon" />
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="main-content-area">
                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Chats</h2>
                        <button
                            className="sidebar-close-button"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <ChevronLeft className="sidebar-icon" />
                        </button>
                    </div>
                    <div className="contact-list">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`contact-item ${selectedContact?.id === contact.id ? 'contact-item-selected' : ''}`}
                                    onClick={() => {
                                        setSelectedContact(contact);
                                        setIsSidebarOpen(false);
                                        setSearchQuery('');
                                        setShowSearchInput(false);
                                    }}
                                >
                                    <div className={`contact-avatar ${contact.id === 'nr' ? 'avatar-blue' :
                                        contact.id === 'sb' ? 'avatar-green' :
                                        contact.id === 'nraj' ? 'avatar-purple' :
                                        contact.id === 's' ? 'avatar-orange' :
                                        contact.id === 'mt' ? 'avatar-pink' :
                                        'avatar-gray'
                                    }`}>
                                        {contact.avatar}
                                    </div>
                                    <div className="contact-info">
                                        <div className="contact-name-time">
                                            <p className="contact-name">{contact.name}</p>
                                            <span className="contact-time">{contact.time}</span>
                                        </div>
                                        <p className="contact-last-message">{contact.lastMessage}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-contacts-found">No contacts found.</p>
                        )}
                    </div>
                </aside>

                {/* Chat Window */}
                {selectedContact ? (
                    <div className="chat-window">
                        <div className="chat-header">
                            {/* Re-add menu button for mobile chat header */}
                            <button
                                className="navbar-menu-button chat-header-menu-button"
                                onClick={() => setIsSidebarOpen(true)} // Open sidebar from chat header
                            >
                                <ChevronLeft className="navbar-icon" />
                            </button>
                            <div className={`chat-header-avatar ${selectedContact.id === 'nr' ? 'avatar-blue' :
                                selectedContact.id === 'sb' ? 'avatar-green' :
                                selectedContact.id === 'nraj' ? 'avatar-purple' :
                                selectedContact.id === 's' ? 'avatar-orange' :
                                selectedContact.id === 'mt' ? 'avatar-pink' :
                                'avatar-gray'
                            }`}>
                                {selectedContact.avatar}
                            </div>
                            <div className="chat-header-info">
                                <h3 className="chat-header-name">{selectedContact.name}</h3>
                                <p className="chat-header-status">{selectedContact.status}</p>
                            </div>
                        </div>

                        <MessagesDisplay messages={allMessages[selectedContact.id] || []} />

                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                ) : (
                    <div className="chat-placeholder">
                        Select a contact to start chatting
                    </div>
                )}
            </div>

            {/* Info Modal */}
            {showInfoModal && (
                <div className="info-modal-overlay">
                    <div className="info-modal-content">
                        <button
                            className="info-modal-close-button"
                            onClick={() => setShowInfoModal(false)}
                        >
                            <X size={20} />
                        </button>
                        <p className="info-modal-text">
                            This App is made By Nikhil Raj. LinkedIn:
                            <a href="https://www.linkedin.com/in/nikhil811307/" target="_blank" rel="noopener noreferrer" className="info-modal-link">
                                https://www.linkedin.com/in/nikhil811307/
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Messages Display Component
function MessagesDisplay({ messages }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="messages-display">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`message-wrapper ${message.type === 'sent' || message.type === 'image' ? 'message-sent' : 'message-received'}`}
                >
                    <div className="message-content">
                        {message.type === 'image' ? (
                            <img src={message.src} alt="sent" className="chat-image" />
                        ) : (
                            <p className="message-text">{message.text}</p>
                        )}
                        <span className="message-time">{message.time}</span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

// Message Input Component
function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        onSendMessage(message);
        setMessage('');
        setShowEmojiPicker(false);
    };

    const handleEmojiClick = (emoji) => {
        setMessage(prevMessage => prevMessage + emoji);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onSendMessage({ type: 'image', src: e.target.result });
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input-form">
            <button
                type="button"
                className="message-input-icon-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Open Emoji Picker"
            >
                <Smile className="message-input-icon" />
            </button>
            <button
                type="button"
                className="message-input-icon-button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach File"
            >
                <Paperclip className="message-input-icon" />
            </button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input-field"
            />
            <button
                type="submit"
                className="message-send-button"
                disabled={message.trim() === ''}
                title="Send Message"
            >
                <Send className="message-send-icon" />
            </button>

            {showEmojiPicker && (
                <div className="emoji-picker-container">
                    <span onClick={() => handleEmojiClick('😊')}>😊</span>
                    <span onClick={() => handleEmojiClick('😂')}>😂</span>
                    <span onClick={() => handleEmojiClick('❤️')}>❤️</span>
                    <span onClick={() => handleEmojiClick('👍')}>👍</span>
                    <span onClick={() => handleEmojiClick('👋')}>👋</span>
                    <span onClick={() => handleEmojiClick('🥳')}>🥳</span>
                    <span onClick={() => handleEmojiClick('🚀')}>🚀</span>
                    <span onClick={() => handleEmojiClick('💡')}>💡</span>
                    <span onClick={() => handleEmojiClick('🎉')}>🎉</span>
                    <span onClick={() => handleEmojiClick('🌟')}>🌟</span>
                </div>
            )}
        </form>
    );
}

export default App;
