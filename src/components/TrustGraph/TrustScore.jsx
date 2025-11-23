import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Loader,
  Star,
  Target,
  Activity
} from 'lucide-react';

const TrustScore = ({ score, isProcessing }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);

  useEffect(() => {
    if (!isProcessing && score !== previousScore) {
      // Animate the score change
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = (score - animatedScore) / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setAnimatedScore(prev => {
          const newScore = prev + increment;
          if (currentStep >= steps) {
            clearInterval(timer);
            return score;
          }
          return newScore;
        });
      }, duration / steps);

      setPreviousScore(score);
      
      return () => clearInterval(timer);
    }
  }, [score, isProcessing, animatedScore, previousScore]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'nova-green';
    if (score >= 60) return 'nova-orange';
    return 'red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'High Trust';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Very Low';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return Star;
    return AlertTriangle;
  };

  const ScoreIcon = getScoreIcon(animatedScore);
  const scoreColor = getScoreColor(animatedScore);

  // Calculate the circumference for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-nova-blue" />
          <h3 className="font-semibold text-nova-gray-900">Trust Score</h3>
        </div>
        <div className="flex items-center space-x-1 text-xs text-nova-gray-500">
          <Activity className="w-3 h-3" />
          <span>Live</span>
        </div>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader className="w-12 h-12 text-nova-blue" />
          </motion.div>
          <p className="text-sm text-nova-gray-600">Calculating trust score...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mb-4">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-nova-gray-200"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`text-${scoreColor}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={Math.floor(animatedScore / 10)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-8 h-8 rounded-full bg-${scoreColor} bg-opacity-10 flex items-center justify-center mb-1`}
              >
                <ScoreIcon className={`w-5 h-5 text-${scoreColor}`} />
              </motion.div>
              <motion.span
                key={animatedScore}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-2xl font-bold text-${scoreColor}`}
              >
                {Math.round(animatedScore)}
              </motion.span>
              <span className="text-xs text-nova-gray-500">out of 100</span>
            </div>
          </div>

          {/* Score Label */}
          <motion.div
            key={getScoreLabel(animatedScore)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h4 className={`text-lg font-semibold text-${scoreColor} mb-1`}>
              {getScoreLabel(animatedScore)}
            </h4>
            <p className="text-sm text-nova-gray-600">
              Trust Level
            </p>
          </motion.div>

          {/* Score Breakdown */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-nova-gray-600">Document Authenticity</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-nova-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(animatedScore + 5, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-nova-green h-2 rounded-full"
                  />
                </div>
                <span className="font-medium text-nova-gray-700 w-8 text-right">
                  {Math.min(Math.round(animatedScore + 5), 100)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-nova-gray-600">Biometric Match</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-nova-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(animatedScore - 2, 0)}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="bg-nova-purple h-2 rounded-full"
                  />
                </div>
                <span className="font-medium text-nova-gray-700 w-8 text-right">
                  {Math.max(Math.round(animatedScore - 2), 0)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-nova-gray-600">Behavioral Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-nova-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${animatedScore}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-nova-blue h-2 rounded-full"
                  />
                </div>
                <span className="font-medium text-nova-gray-700 w-8 text-right">
                  {Math.round(animatedScore)}
                </span>
              </div>
            </div>
          </div>

          {/* Score Change Indicator */}
          <AnimatePresence>
            {score > previousScore && previousScore > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-3 flex items-center space-x-1 text-sm text-nova-green"
              >
                <TrendingUp className="w-4 h-4" />
                <span>+{Math.round(score - previousScore)} points</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Message */}
          <div className={`mt-4 w-full p-3 rounded-lg border ${
            animatedScore >= 80 
              ? 'bg-nova-green-light border-nova-green text-nova-green'
              : animatedScore >= 60
              ? 'bg-nova-orange-light border-nova-orange text-nova-orange'  
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                {animatedScore >= 80 ? (
                  <span>Strong verification signals detected. High confidence in identity authenticity.</span>
                ) : animatedScore >= 60 ? (
                  <span>Good verification results. Some additional checks may be required.</span>
                ) : (
                  <span>Additional verification steps recommended for enhanced security.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustScore;
