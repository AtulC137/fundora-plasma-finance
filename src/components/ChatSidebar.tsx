
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { X, Send } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  senderName: string;
  senderImage?: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const ChatSidebar = ({ isOpen, onClose, user }: ChatSidebarProps) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample investors data
  const [investors] = useState([
    { id: '1', name: 'John Doe', image: '', lastMessage: 'Interested in your invoice' },
    { id: '2', name: 'Jane Smith', image: '', lastMessage: 'Can you provide more details?' },
    { id: '3', name: 'Robert Johnson', image: '', lastMessage: 'Looking to invest' },
  ]);

  // Sample messages
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', senderId: '1', receiverId: 'user', content: 'Hello, I\'m interested in your invoice #1234', timestamp: '2023-05-02T14:30:00', senderName: 'John Doe' },
      { id: '2', senderId: 'user', receiverId: '1', content: 'Thank you for your interest! What would you like to know?', timestamp: '2023-05-02T14:35:00', senderName: user.username || user.email }
    ],
    '2': [
      { id: '1', senderId: '2', receiverId: 'user', content: 'Can you provide more details about your business?', timestamp: '2023-05-01T10:15:00', senderName: 'Jane Smith' },
      { id: '2', senderId: 'user', receiverId: '2', content: 'Of course, we\'ve been in operation for 5 years.', timestamp: '2023-05-01T10:20:00', senderName: user.username || user.email }
    ],
    '3': [
      { id: '1', senderId: '3', receiverId: 'user', content: 'I\'m looking to invest in invoices like yours', timestamp: '2023-04-28T16:45:00', senderName: 'Robert Johnson' },
      { id: '2', senderId: 'user', receiverId: '3', content: 'Great! I have several available invoices.', timestamp: '2023-04-28T16:50:00', senderName: user.username || user.email }
    ]
  });

  const filteredInvestors = investors.filter(investor => 
    investor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      receiverId: activeChat,
      content: messageInput,
      timestamp: new Date().toISOString(),
      senderName: user.username || user.email,
      senderImage: user.profileImage
    };
    
    setMessages(prevMessages => ({
      ...prevMessages,
      [activeChat]: [...(prevMessages[activeChat] || []), newMessage]
    }));
    
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`fixed right-0 top-0 h-screen glass-morphism border-l border-fundora-blue/30 transition-all duration-300 z-40 ${isOpen ? 'w-80' : 'w-0'}`}>
      {isOpen && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-fundora-blue/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gradient">Messages</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="p-3 border-b border-fundora-blue/30">
            <Input 
              placeholder="Search investors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border-fundora-blue/30 text-white"
            />
          </div>
          
          {!activeChat ? (
            /* List of investors */
            <div className="flex-1 overflow-y-auto">
              {filteredInvestors.map(investor => (
                <div 
                  key={investor.id}
                  onClick={() => setActiveChat(investor.id)}
                  className="p-3 hover:bg-fundora-blue/20 cursor-pointer border-b border-fundora-blue/10 flex items-center"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    {investor.image ? (
                      <AvatarImage src={investor.image} />
                    ) : (
                      <AvatarFallback className="bg-fundora-blue/30 text-white">
                        {getInitials(investor.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{investor.name}</p>
                    <p className="text-sm text-gray-400 truncate">{investor.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Active chat */
            <div className="flex flex-col h-full">
              {/* Chat header */}
              <div className="p-3 border-b border-fundora-blue/30 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2"
                  onClick={() => setActiveChat(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-fundora-blue/30 text-white">
                    {getInitials(investors.find(i => i.id === activeChat)?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">
                  {investors.find(i => i.id === activeChat)?.name}
                </span>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[activeChat]?.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] ${
                        message.senderId === 'user' 
                          ? 'bg-fundora-blue text-white rounded-l-lg rounded-br-lg' 
                          : 'bg-white/10 text-white rounded-r-lg rounded-bl-lg'
                      } px-3 py-2`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input */}
              <div className="p-3 border-t border-fundora-blue/30 flex">
                <Input 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 mr-2 bg-white/10 border-fundora-blue/30 text-white"
                />
                <Button onClick={sendMessage} className="bg-fundora-blue hover:bg-fundora-blue/80">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
