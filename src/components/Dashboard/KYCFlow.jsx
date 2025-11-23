import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  MessageCircle, 
  Shield,
  Eye,
  Brain,
  Loader,
  FileText,
  User,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import DocumentUpload from '../SmartVision/DocumentUpload';
import FaceVerification from '../SmartVision/FaceVerification';
import ChatInterface from '../ConversationalAI/ChatInterface';
import TrustScore from '../TrustGraph/TrustScore';
import ExplainabilityCard from '../TrustGraph/ExplainabilityCard';

const KYCFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({});
  const [trustScore, setTrustScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      content: "Hello! I'm Nova, your AI verification assistant. I'll guide you through a simple and secure onboarding process. Ready to get started?",
      timestamp: new Date()
    }
  ]);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      icon: MessageCircle,
      description: 'Meet your AI assistant'
    },
    {
      id: 'document',
      title: 'Document Upload',
      icon: FileText,
      description: 'SmartVision+ analysis'
    },
    {
      id: 'face-verification',
      title: 'Face Verification',
      icon: User,
      description: 'Biometric matching'
    },
    {
      id: 'trust-assessment',
      title: 'Trust Assessment',
      icon: Shield,
      description: 'TrustGraph analysis'
    },
    {
      id: 'completion',
      title: 'Complete',
      icon: CheckCircle,
      description: 'Verification success'
    }
  ];

  useEffect(() => {
    // Simulate initial trust score calculation
    setTimeout(() => {
      setTrustScore(45);
    }, 1000);
  }, []);

  const handleStepComplete = (stepData) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      if (currentStep === 1) {
        // Document processing complete
        setUserProfile(prev => ({
          ...prev,
          document: stepData,
          name: stepData.extractedData?.name || 'John Doe',
          documentNumber: stepData.extractedData?.documentNumber || 'ID123456789',
          dateOfBirth: stepData.extractedData?.dateOfBirth || '1990-01-01',
          nationality: stepData.extractedData?.nationality || 'United States'
        }));
        setTrustScore(65);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: "Perfect! Your ID looks authentic. I've extracted your information and verified the document security features. Let's now verify your identity with a quick face scan.",
          timestamp: new Date()
        }]);
      } else if (currentStep === 2) {
        // Face verification complete
        setUserProfile(prev => ({
          ...prev,
          faceMatch: stepData
        }));
        setTrustScore(85);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: "Excellent! Your face matches your ID perfectly. I'm now running our final TrustGraph analysis to complete your verification.",
          timestamp: new Date()
        }]);
      } else if (currentStep === 3) {
        // Trust assessment complete
        setTrustScore(94);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: "Congratulations! Your verification is complete with a high trust score of 94%. You're all set to access our services. Welcome aboard!",
          timestamp: new Date()
        }]);
      }
      
      setIsProcessing(false);
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 2000);
  };

  const addChatMessage = (message) => {
    setChatMessages(prev => [...prev, {
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'm here to help! Let me guide you through this step.",
        "That's a great question. This process ensures your security and privacy.",
        "No worries, I'll make sure everything goes smoothly.",
        "Your data is protected with enterprise-grade encryption throughout this process."
      ];
      
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-nova-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-nova-gray-900 mb-4">
            KYC Nova <span className="text-nova-blue">Demo Experience</span>
          </h1>
          <p className="text-xl text-nova-gray-600 max-w-3xl mx-auto">
            Experience the future of onboarding with our AI-powered verification system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: index === currentStep ? 1.1 : (index < currentStep ? 1 : 0.8),
                    opacity: index <= currentStep ? 1 : 0.5
                  }}
                  className={`flex flex-col items-center min-w-0 ${
                    index <= currentStep ? 'text-nova-blue' : 'text-nova-gray-400'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep 
                      ? 'bg-nova-green text-white' 
                      : index === currentStep 
                      ? 'bg-nova-blue text-white' 
                      : 'bg-nova-gray-200 text-nova-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs opacity-75">{step.description}</p>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <ArrowRight className={`w-4 h-4 mx-2 ${
                    index < currentStep ? 'text-nova-green' : 'text-nova-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card"
                >
                  <div className="text-center py-12">
                    <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-nova-gray-900 mb-4">
                      Welcome to KYC Nova
                    </h2>
                    <p className="text-lg text-nova-gray-600 mb-8 max-w-2xl mx-auto">
                      I'm Nova, your AI verification assistant. I'll guide you through a simple, 
                      secure process that typically takes under 5 minutes.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-nova-blue mx-auto mb-2" />
                        <h3 className="font-semibold">SmartVision+</h3>
                        <p className="text-sm text-nova-gray-600">Document analysis</p>
                      </div>
                      <div className="text-center">
                        <Brain className="w-8 h-8 text-nova-purple mx-auto mb-2" />
                        <h3 className="font-semibold">AI Guidance</h3>
                        <p className="text-sm text-nova-gray-600">Step-by-step help</p>
                      </div>
                      <div className="text-center">
                        <Shield className="w-8 h-8 text-nova-green mx-auto mb-2" />
                        <h3 className="font-semibold">TrustGraph</h3>
                        <p className="text-sm text-nova-gray-600">Risk assessment</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStepComplete({})}
                      className="btn-primary"
                    >
                      Start Verification Process
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="document"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <DocumentUpload onComplete={handleStepComplete} />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="face"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <FaceVerification 
                    onComplete={handleStepComplete} 
                    documentImage={userProfile.document?.capturedImage}
                    useAWSRekognition={true}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="trust"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="card">
                    <h2 className="text-2xl font-bold text-nova-gray-900 mb-4">
                      TrustGraph Analysis
                    </h2>
                    <div className="flex items-center justify-center py-8">
                      {isProcessing ? (
                        <div className="text-center">
                          <Loader className="w-12 h-12 text-nova-blue animate-spin mx-auto mb-4" />
                          <p className="text-nova-gray-600">Analyzing trust signals...</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStepComplete({ trustScore: 94 })}
                          className="btn-primary"
                        >
                          Complete Trust Assessment
                        </button>
                      )}
                    </div>
                  </div>
                  <ExplainabilityCard userProfile={userProfile} />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card text-center py-12"
                >
                  <div className="w-20 h-20 bg-nova-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-nova-gray-900 mb-4">
                    Verification Complete!
                  </h2>
                  <p className="text-lg text-nova-gray-600 mb-6">
                    Welcome {userProfile.name || 'User'}! Your account has been successfully verified.
                  </p>
                  <div className="bg-nova-green-light rounded-lg p-4 mb-6">
                    <p className="text-nova-green font-semibold">
                      Trust Score: {trustScore}% - Verification Successful
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setCurrentStep(0);
                        setUserProfile({});
                        setTrustScore(0);
                        setChatMessages([{
                          type: 'ai',
                          content: "Hello! I'm Nova, your AI verification assistant. Ready for another demo?",
                          timestamp: new Date()
                        }]);
                      }}
                      className="btn-secondary"
                    >
                      Try Again
                    </button>
                    <button className="btn-primary">
                      View Dashboard
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust Score */}
            <TrustScore score={trustScore} isProcessing={isProcessing} />

            {/* Chat Interface */}
            <ChatInterface 
              messages={chatMessages}
              onSendMessage={addChatMessage}
              currentStep={currentStep}
            />

            {/* User Profile */}
            {Object.keys(userProfile).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-nova-gray-900 mb-4">
                  Extracted Information
                </h3>
                <div className="space-y-3">
                  {userProfile.name && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-nova-gray-400" />
                      <span className="text-sm text-nova-gray-600">Name:</span>
                      <span className="text-sm font-medium">{userProfile.name}</span>
                    </div>
                  )}
                  {userProfile.documentNumber && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-nova-gray-400" />
                      <span className="text-sm text-nova-gray-600">ID:</span>
                      <span className="text-sm font-medium">{userProfile.documentNumber}</span>
                    </div>
                  )}
                  {userProfile.nationality && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-nova-gray-400" />
                      <span className="text-sm text-nova-gray-600">Country:</span>
                      <span className="text-sm font-medium">{userProfile.nationality}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KYCFlow;
