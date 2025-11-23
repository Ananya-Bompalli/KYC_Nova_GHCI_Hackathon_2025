import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import PersonalDetailsForm from './PersonalDetailsForm';
import AadhaarScanner from './AadhaarScanner';
import LivenessDetection from './LivenessDetection';
import VerificationResults from './VerificationResults';
import ProgressiveTrustGraph from './ProgressiveTrustGraph';
import ChatInterfaceSidebar from './ChatInterfaceSidebar';

const CompleteKYCFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [collectedData, setCollectedData] = useState({
    personalDetails: null,
    aadhaarData: null,
    livenessResult: null,
    finalResult: null
  });
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handlePersonalDetailsComplete = (data) => {
    setCollectedData(prev => ({
      ...prev,
      personalDetails: data
    }));
    setCurrentStep(2);
    
    // Auto-publish chat message for step completion
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('addChatMessage', {
        detail: {
          type: 'assistant',
          message: `✅ **Personal Details Collected Successfully!**\n\nI've captured your information:\n• **Name:** ${data.personalDetails.name}\n• **Date of Birth:** ${data.personalDetails.dateOfBirth}\n• **Address:** ${data.personalDetails.address}\n\nMoving to document verification next. Please have your Aadhaar card ready for scanning.`
        }
      }));
    }, 1000);
  };

  const handleAadhaarScanComplete = (data) => {
    setCollectedData(prev => ({
      ...prev,
      aadhaarData: data
    }));
    setCurrentStep(3);
    
    // Auto-publish chat message for step completion
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('addChatMessage', {
        detail: {
          type: 'assistant',
          message: `🔍 **Document Scan Complete!**\n\nSuccessfully extracted information from Aadhaar card:\n• **Name:** ${data.aadhaarData.name}\n• **DOB:** ${data.aadhaarData.dateOfBirth}\n• **Address:** ${data.aadhaarData.address}\n• **Confidence:** ${data.scanMetadata.confidence}%\n\nNext, we'll verify you're a live person using our enhanced liveness detection system.`
        }
      }));
    }, 1500);
  };

  const handleLivenessComplete = (data) => {
    setCollectedData(prev => ({
      ...prev,
      livenessResult: data
    }));
    setCurrentStep(4);
    
    // Auto-publish chat message for step completion
    setTimeout(() => {
      const status = data.success ? 'Passed' : 'Failed';
      const statusEmoji = data.success ? '✅' : '❌';
      window.dispatchEvent(new CustomEvent('addChatMessage', {
        detail: {
          type: 'assistant',
          message: `${statusEmoji} **Liveness Detection ${status}!**\n\n${data.reason}\n• **Confidence:** ${data.confidence}%\n• **Scenario:** ${data.scenario === 'normal' ? 'Live Person Detected' : data.scenario}\n• **Risk Level:** ${data.riskAssessment?.overallRisk || 'LOW'}\n\nProceding to final verification and results analysis...`
        }
      }));
    }, 2000);
  };

  const handleVerificationComplete = (data) => {
    setCollectedData(prev => ({
      ...prev,
      finalResult: data
    }));
    console.log('Complete KYC verification data:', {
      ...collectedData,
      finalResult: data
    });
  };

  const handleRetry = () => {
    setCollectedData({
      personalDetails: null,
      aadhaarData: null,
      livenessResult: null,
      finalResult: null
    });
    setCurrentStep(1);
  };

  const steps = [
    { number: 1, title: 'Personal Information', component: 'form' },
    { number: 2, title: 'Document Scan', component: 'scanner' },
    { number: 3, title: 'Liveness Detection', component: 'liveness' },
    { number: 4, title: 'Verification Results', component: 'results' }
  ];

  return (
    <div className="min-h-screen bg-nova-gray-50">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-nova-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-nova-gray-900">
              Complete KYC Verification
            </h1>
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.number 
                      ? 'bg-nova-green text-white' 
                      : currentStep === step.number
                      ? 'bg-nova-purple text-white'
                      : 'bg-nova-gray-200 text-nova-gray-600'
                  }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ml-2 ${
                      currentStep > step.number ? 'bg-nova-green' : 'bg-nova-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Title */}
          <div className="mt-2">
            <h2 className="text-sm font-medium text-nova-gray-600">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content with Right Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main KYC Flow */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <PersonalDetailsForm onComplete={handlePersonalDetailsComplete} />
                )}
                
                {currentStep === 2 && (
                  <AadhaarScanner 
                    onComplete={handleAadhaarScanComplete}
                    personalDetails={collectedData.personalDetails?.personalDetails}
                  />
                )}
                
                {currentStep === 3 && (
                  <LivenessDetection 
                    onComplete={handleLivenessComplete}
                  />
                )}
                
                {currentStep === 4 && (
                  <VerificationResults
                    personalDetails={collectedData.personalDetails}
                    aadhaarData={collectedData.aadhaarData}
                    livenessResult={collectedData.livenessResult}
                    onComplete={handleVerificationComplete}
                    onRetry={handleRetry}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Trust Graph & Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Trust Graph */}
              <ProgressiveTrustGraph 
                currentStep={currentStep}
                stepData={collectedData}
              />
              
              {/* Chat Interface - Always Visible */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <ChatInterfaceSidebar
                  currentStep={currentStep}
                  stepData={collectedData}
                  isVisible={true}
                  onToggle={() => {}} // Always visible, no toggle needed
                  isEmbedded={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <div className="space-y-1">
            <div>Current Step: {currentStep}</div>
            <div>Personal Details: {collectedData.personalDetails ? '✓' : '✗'}</div>
            <div>Aadhaar Data: {collectedData.aadhaarData ? '✓' : '✗'}</div>
            <div>Liveness Result: {collectedData.livenessResult ? '✓' : '✗'}</div>
            <div>Final Result: {collectedData.finalResult ? '✓' : '✗'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteKYCFlow;
