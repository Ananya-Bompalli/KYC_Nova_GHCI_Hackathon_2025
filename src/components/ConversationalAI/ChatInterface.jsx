import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Loader,
  Brain,
  Sparkles
} from 'lucide-react';

const ChatInterface = ({ messages, onSendMessage, currentStep }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      setIsTyping(true);
      
      // Simulate typing indicator
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const voiceMessages = [
          "What happens to my data after verification?",
          "How secure is this process?",
          "Can I use this on my phone?",
          "How long does verification usually take?"
        ];
        const randomMessage = voiceMessages[Math.floor(Math.random() * voiceMessages.length)];
        setNewMessage(randomMessage);
        setIsListening(false);
      }, 3000);
    }
  };

  const getQuickReplies = () => {
    switch (currentStep) {
      case 0:
        return [
          "How secure is this process?",
          "What documents do I need?",
          "How long will this take?"
        ];
      case 1:
        return [
          "What if my photo is blurry?",
          "Can I use my phone camera?",
          "Is my data stored?"
        ];
      case 2:
        return [
          "Why do you need my face?",
          "Is this safe?",
          "What about privacy?"
        ];
      case 3:
        return [
          "What is TrustGraph?",
          "How is my score calculated?",
          "Can I improve my score?"
        ];
      default:
        return [
          "Start over",
          "View my results",
          "Contact support"
        ];
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="card h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-nova-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-nova-blue bg-opacity-10 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-nova-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-nova-gray-900">Nova Assistant</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-nova-green rounded-full animate-pulse"></div>
              <span className="text-xs text-nova-gray-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled 
                ? 'text-nova-blue hover:bg-nova-blue-light' 
                : 'text-nova-gray-400 hover:bg-nova-gray-100'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-nova-blue text-white' 
                    : 'bg-nova-green text-white'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-nova-blue text-white rounded-br-md'
                    : 'bg-nova-gray-100 text-nova-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-nova-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-nova-green text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-nova-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-nova-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-nova-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-nova-gray-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {getQuickReplies().map((reply, index) => (
            <button
              key={index}
              onClick={() => {
                setNewMessage(reply);
                inputRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 bg-nova-gray-100 text-nova-gray-700 rounded-full hover:bg-nova-blue-light hover:text-nova-blue transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Nova anything..."
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-nova-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-nova-blue focus:border-nova-blue outline-none"
            style={{ maxHeight: '80px' }}
          />
          <button
            onClick={toggleVoiceRecording}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
              isListening 
                ? 'text-red-500 bg-red-50 animate-pulse' 
                : 'text-nova-gray-400 hover:text-nova-blue hover:bg-nova-blue-light'
            }`}
          >
            {isListening ? <Loader className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`p-3 rounded-lg transition-all duration-200 ${
            newMessage.trim()
              ? 'bg-nova-blue text-white hover:bg-nova-blue-dark shadow-lg hover:shadow-xl'
              : 'bg-nova-gray-200 text-nova-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Recording Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-sm text-red-500">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
            <span>Listening... Speak now</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatInterface;
