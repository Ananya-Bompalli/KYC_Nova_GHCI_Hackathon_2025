import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  User,
  CreditCard,
  Eye,
  Award
} from 'lucide-react';

const ProgressiveTrustGraph = ({ currentStep, stepData }) => {
  const [trustScore, setTrustScore] = useState(0);
  const [stepScores, setStepScores] = useState({
    step1: 0, // Personal Details
    step2: 0, // Document Scan  
    step3: 0, // Liveness Detection
    step4: 0  // Final Verification
  });

  // Calculate trust score based on current step and data
  useEffect(() => {
    calculateProgressiveTrustScore();
  }, [currentStep, stepData]);

  const calculateProgressiveTrustScore = () => {
    let newStepScores = { ...stepScores };
    let totalScore = 0;

    // Step 1: Personal Details (25 points max)
    if (currentStep >= 1 && stepData?.personalDetails) {
      const personalScore = 25; // Always full points for completing personal details
      newStepScores.step1 = personalScore;
      totalScore += personalScore;
    }

    // Step 2: Document Scan (30 points max)
    if (currentStep >= 2 && stepData?.aadhaarData) {
      const confidence = stepData.aadhaarData.scanMetadata?.confidence || 94.7;
      const documentScore = Math.round((confidence / 100) * 30);
      newStepScores.step2 = documentScore;
      totalScore += documentScore;
    }

    // Step 3: Liveness Detection (35 points max)
    if (currentStep >= 3 && stepData?.livenessResult) {
      const livenessConfidence = stepData.livenessResult.confidence || 95;
      const livenessScore = Math.round((livenessConfidence / 100) * 35);
      newStepScores.step3 = livenessScore;
      totalScore += livenessScore;
    }

    // Step 4: Cross-verification bonus (10 points max)
    if (currentStep >= 4 && stepData?.finalResult) {
      const matchBonus = stepData.finalResult.success ? 10 : 0;
      newStepScores.step4 = matchBonus;
      totalScore += matchBonus;
    }

    setStepScores(newStepScores);
    setTrustScore(totalScore);
  };

  const steps = [
    {
      id: 1,
      title: 'Personal Details',
      icon: User,
      maxScore: 25,
      description: 'Information completeness',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Document Scan',
      icon: CreditCard,
      maxScore: 30,
      description: 'Aadhaar authenticity',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      title: 'Liveness Check',
      icon: Eye,
      maxScore: 35,
      description: 'Biometric verification',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      title: 'Cross-Verification',
      icon: Award,
      maxScore: 10,
      description: 'Data matching bonus',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getTrustLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 80) return { level: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 60) return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const trustLevel = getTrustLevel(trustScore);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-nova-purple mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Trust Score</h3>
        </div>
        <div className="text-right">
          <motion.div
            key={trustScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${trustLevel.color}`}
          >
            {trustScore}
          </motion.div>
          <div className="text-sm text-gray-600">out of 100</div>
        </div>
      </div>

      {/* Trust Level Indicator */}
      <div className={`${trustLevel.bgColor} ${trustLevel.color} px-3 py-1 rounded-full text-sm font-medium text-center mb-4`}>
        {trustLevel.level} Trust Level
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{trustScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${trustScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              trustScore >= 90 ? 'bg-green-500' :
              trustScore >= 80 ? 'bg-blue-500' :
              trustScore >= 70 ? 'bg-yellow-500' :
              trustScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>

      {/* Step Breakdown */}
      <div className="space-y-3">
        {steps.map((step) => {
          const stepScore = stepScores[`step${step.id}`];
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const percentage = (stepScore / step.maxScore) * 100;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border ${
                isCompleted ? 'border-green-200 bg-green-50' :
                isActive ? `border-${step.color.split('-')[1]}-200 ${step.bgColor}` :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    isCompleted ? 'bg-green-500' :
                    isActive ? `bg-${step.color.split('-')[1]}-500` :
                    'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <step.icon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      isCompleted ? 'text-green-800' :
                      isActive ? step.color : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    isCompleted ? 'text-green-600' :
                    isActive ? step.color : 'text-gray-600'
                  }`}>
                    {stepScore}/{step.maxScore}
                  </div>
                </div>
              </div>
              
              {/* Step Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: step.id * 0.1 }}
                  className={`h-2 rounded-full ${
                    isCompleted ? 'bg-green-500' :
                    isActive ? `bg-${step.color.split('-')[1]}-500` :
                    'bg-gray-300'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step Indicator */}
      {currentStep < 4 && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Complete next step to increase trust score</span>
          </div>
        </div>
      )}

      {/* Final Message */}
      {currentStep === 4 && stepData?.finalResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg text-center ${
            stepData.finalResult.success 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="font-semibold">
            {stepData.finalResult.success ? '🎉 Verification Complete!' : '⚠️ Verification Failed'}
          </div>
          <div className="text-sm mt-1">
            {stepData.finalResult.success 
              ? `Excellent trust score of ${trustScore}%` 
              : 'Please review and try again'}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressiveTrustGraph;
