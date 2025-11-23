import React from 'react';
import { motion } from 'framer-motion';
import { Loader, CheckCircle } from 'lucide-react';

const ProcessingAnimation = ({ steps, currentStep, fileName }) => {
  const getCurrentStepData = () => {
    return steps.find(step => step.id === currentStep);
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const currentStepData = getCurrentStepData();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12"
    >
      {/* File Info */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-nova-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 text-nova-blue" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-nova-gray-900 mb-2">
          Processing Document
        </h3>
        <p className="text-nova-gray-600">
          {fileName || 'your-document.jpg'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-3 rounded-lg ${
                  isCurrent ? 'bg-nova-blue-light border border-nova-blue' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-nova-green text-white' 
                    : isCurrent 
                    ? 'bg-nova-blue text-white' 
                    : 'bg-nova-gray-200 text-nova-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <step.icon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCompleted ? 'text-nova-green' : isCurrent ? 'text-nova-blue' : 'text-nova-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>

                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex space-x-1"
                  >
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-nova-blue rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-nova-blue rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-nova-blue rounded-full"
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-nova-gray-700">Processing</span>
            <span className="text-sm text-nova-gray-500">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-nova-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-nova-blue h-2 rounded-full"
            />
          </div>
        </div>

        {/* Current Step Message */}
        {currentStepData && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-nova-gray-600">
              {currentStepData.label}
            </p>
          </motion.div>
        )}
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center space-x-2 text-sm text-nova-gray-500">
          <div className="w-2 h-2 bg-nova-green rounded-full animate-pulse" />
          <span>Your document is processed securely on-device</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingAnimation;
