import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

const ChatInterfaceSidebar = ({ currentStep, stepData, isVisible, onToggle, isEmbedded = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addSystemMessage(
        "Welcome to KYC Nova! 👋 I'm here to help you through the verification process. Feel free to ask any questions!",
        'welcome'
      );
    }
  }, []);

  // Listen for custom chat events
  useEffect(() => {
    const handleChatMessage = (event) => {
      const { type, message } = event.detail;
      const newMessage = {
        id: Date.now(),
        type: 'system',
        content: message,
        timestamp: new Date(),
        messageType: 'success'
      };
      setMessages(prev => [...prev, newMessage]);
    };

    window.addEventListener('addChatMessage', handleChatMessage);
    
    return () => {
      window.removeEventListener('addChatMessage', handleChatMessage);
    };
  }, []);

  // Add step completion messages
  useEffect(() => {
    if (currentStep && stepData) {
      addStepCompletionMessage(currentStep, stepData);
    }
  }, [currentStep, stepData]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSystemMessage = (content, type = 'info') => {
    const message = {
      id: Date.now(),
      type: 'system',
      content,
      timestamp: new Date(),
      messageType: type
    };
    setMessages(prev => [...prev, message]);
  };

  const addStepCompletionMessage = (step, data) => {
    let message = '';
    let type = 'success';

    switch (step) {
      case 1:
        if (data.personalDetails) {
          message = `✅ Personal details completed! Welcome, ${data.personalDetails.personalDetails.name}. Moving to document verification.`;
        }
        break;
      case 2:
        if (data.aadhaarData) {
          const confidence = data.aadhaarData.scanMetadata?.confidence || 0;
          message = `✅ Document scan successful! Aadhaar card verified with ${confidence}% confidence. Starting liveness detection.`;
        }
        break;
      case 3:
        if (data.livenessResult) {
          const confidence = data.livenessResult.confidence || 0;
          const success = data.livenessResult.success;
          if (success) {
            message = `✅ Liveness detection passed! Live person verified with ${confidence}% confidence. Processing final results.`;
          } else {
            message = `❌ Liveness detection failed. ${data.livenessResult.reason || 'Please try again.'}`;
            type = 'error';
          }
        }
        break;
      case 4:
        if (data.finalResult) {
          const success = data.finalResult.success;
          const trustScore = data.finalResult.trustScore || 0;
          if (success) {
            message = `🎉 Verification complete! Your identity has been successfully verified with a trust score of ${trustScore}%. Welcome to KYC Nova!`;
          } else {
            message = `❌ Verification failed. Trust score: ${trustScore}%. Please review your information and try again.`;
            type = 'error';
          }
        }
        break;
    }

    if (message) {
      addSystemMessage(message, type);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage.toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const generateAIResponse = (userInput) => {
    // Simple keyword-based responses
    if (userInput.includes('help') || userInput.includes('stuck') || userInput.includes('problem')) {
      return "I'm here to help! What specific issue are you facing? You can ask about any step in the verification process.";
    }
    
    if (userInput.includes('camera') || userInput.includes('webcam')) {
      return "For camera issues: 1) Make sure you've allowed camera permissions, 2) Check that no other applications are using your camera, 3) Try refreshing the page if needed.";
    }
    
    if (userInput.includes('document') || userInput.includes('aadhaar') || userInput.includes('scan')) {
      return "For document scanning: 1) Ensure good lighting, 2) Keep the document flat and fully visible, 3) Make sure the QR code is clear, 4) Avoid glare or shadows.";
    }
    
    if (userInput.includes('liveness') || userInput.includes('face') || userInput.includes('detection')) {
      return "For liveness detection: 1) Look directly at the camera, 2) Follow the on-screen instructions, 3) Ensure your face is well-lit and clearly visible, 4) Avoid covering the camera.";
    }
    
    if (userInput.includes('data') || userInput.includes('information') || userInput.includes('details')) {
      return "Your data is processed securely and used only for verification purposes. We compare the information you provide with what's extracted from your documents to ensure accuracy.";
    }
    
    if (userInput.includes('trust') || userInput.includes('score')) {
      return "Your trust score is calculated based on: 25% personal details completion, 30% document authenticity, 35% liveness verification, and 10% cross-verification bonus. Higher scores indicate stronger verification.";
    }
    
    if (userInput.includes('time') || userInput.includes('long') || userInput.includes('duration')) {
      return "The entire verification process typically takes 3-5 minutes. Each step is designed to be quick while maintaining security and accuracy.";
    }
    
    if (userInput.includes('safe') || userInput.includes('secure') || userInput.includes('privacy')) {
      return "Your security is our priority. All data is encrypted, processed locally where possible, and we follow strict privacy guidelines. No personal information is stored unnecessarily.";
    }
    
    if (userInput.includes('fail') || userInput.includes('failed') || userInput.includes('error')) {
      return "If verification fails: 1) Check that all information matches your documents exactly, 2) Ensure good lighting and camera quality, 3) Try the process again, 4) Contact support if issues persist.";
    }

    // Default responses
    const defaultResponses = [
      "That's a great question! Could you be more specific about what you'd like to know?",
      "I'm here to help with the KYC verification process. What would you like assistance with?",
      "Thanks for asking! Is there a particular step in the verification you need help with?",
      "I'd be happy to help you with that. Could you provide more details about your question?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const getMessageIcon = (messageType) => {
    switch (messageType) {
      case 'welcome': return <Bot className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'info': return <HelpCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageColor = (messageType) => {
    switch (messageType) {
      case 'welcome': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const quickQuestions = [
    "How long does verification take?",
    "Is my data secure?",
    "What if my camera doesn't work?",
    "Why did verification fail?",
    "How is trust score calculated?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    handleSendMessage();
  };

  if (!isVisible) return null;

  if (isEmbedded) {
    return (
      <div className="flex flex-col h-96">
        {/* Embedded Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-nova-purple text-white rounded-t-lg">
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            <h4 className="font-medium text-sm">KYC Assistant</h4>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs rounded-lg p-2 text-xs ${
                  message.type === 'user'
                    ? 'bg-nova-purple text-white'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-50 text-blue-900'
                }`}
              >
                {message.type !== 'user' && (
                  <div className={`flex items-center mb-1 ${getMessageColor(message.messageType)}`}>
                    {getMessageIcon(message.messageType)}
                    <span className="ml-1 text-xs font-medium">
                      {message.type === 'system' ? 'System' : 'Assistant'}
                    </span>
                  </div>
                )}
                <p className="text-xs">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-nova-purple"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-2 py-1 bg-nova-purple text-white rounded hover:bg-nova-purple-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl z-50 ${
        isMinimized ? 'w-80' : 'w-96'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-nova-purple text-white">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          <h3 className="font-semibold">KYC Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-nova-purple text-white'
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-50 text-blue-900'
                    }`}
                  >
                    {message.type !== 'user' && (
                      <div className={`flex items-center mb-1 ${getMessageColor(message.messageType)}`}>
                        {getMessageIcon(message.messageType)}
                        <span className="ml-1 text-xs font-medium">
                          {message.type === 'system' ? 'System' : 'Assistant'}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Questions:</p>
                <div className="space-y-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nova-purple focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2 bg-nova-purple text-white rounded-lg hover:bg-nova-purple-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized View */}
      {isMinimized && (
        <div className="p-4 text-center">
          <Bot className="w-8 h-8 text-nova-purple mx-auto mb-2" />
          <p className="text-sm text-gray-600">Assistant is here to help</p>
          <div className="mt-2">
            {messages.filter(m => m.type === 'user').length > 0 && (
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto animate-pulse"></div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatInterfaceSidebar;
