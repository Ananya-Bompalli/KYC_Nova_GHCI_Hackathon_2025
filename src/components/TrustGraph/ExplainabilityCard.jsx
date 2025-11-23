import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  User, 
  FileText, 
  Shield, 
  Brain,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';

const ExplainabilityCard = ({ userProfile }) => {
  const [expandedSections, setExpandedSections] = useState({
    document: true,
    biometric: false,
    behavioral: false,
    risk: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const explainabilityData = {
    document: {
      title: 'Document Analysis',
      icon: FileText,
      color: 'nova-green',
      score: 98,
      factors: [
        {
          factor: 'Security Features',
          impact: 'High Positive',
          score: 97,
          description: 'All security features (hologram, microtext, UV features) verified authentic',
          details: ['Hologram authenticity: 99.2%', 'Microtext legibility: 98.5%', 'UV pattern match: 96.8%']
        },
        {
          factor: 'Document Quality',
          impact: 'Medium Positive',
          score: 94,
          description: 'High-resolution image with clear text extraction',
          details: ['Image resolution: 1920x1080', 'Text clarity: 96%', 'No blur detected']
        },
        {
          factor: 'Data Consistency',
          impact: 'High Positive',
          score: 99,
          description: 'All extracted fields are consistent and properly formatted',
          details: ['Date format validation: Pass', 'Name consistency: 100%', 'Number format: Valid']
        }
      ]
    },
    biometric: {
      title: 'Biometric Verification',
      icon: User,
      color: 'nova-purple',
      score: 96,
      factors: [
        {
          factor: 'Facial Recognition',
          impact: 'High Positive',
          score: 97,
          description: 'Strong match between live photo and document image',
          details: ['Facial landmarks: 98.2% match', 'Eye distance ratio: 97.1%', 'Jawline comparison: 96.8%']
        },
        {
          factor: 'Liveness Detection',
          impact: 'Medium Positive',
          score: 94,
          description: 'Natural micro-movements and blinking patterns detected',
          details: ['Blink rate: Normal', 'Head movement: Natural', 'Texture analysis: Genuine']
        },
        {
          factor: 'Image Quality',
          impact: 'Low Positive',
          score: 92,
          description: 'Good lighting and positioning for accurate analysis',
          details: ['Lighting score: 91%', 'Face visibility: 100%', 'No obstructions: Confirmed']
        }
      ]
    },
    behavioral: {
      title: 'Behavioral Signals',
      icon: Brain,
      color: 'nova-blue',
      score: 89,
      factors: [
        {
          factor: 'Interaction Patterns',
          impact: 'Medium Positive',
          score: 87,
          description: 'Natural user behavior throughout the verification process',
          details: ['Mouse movement: Human-like', 'Typing cadence: Natural', 'Click patterns: Normal']
        },
        {
          factor: 'Device Trust',
          impact: 'Low Positive',
          score: 91,
          description: 'Device shows normal usage patterns and security features',
          details: ['Device age: 2.3 years', 'Security updates: Current', 'No VPN detected']
        },
        {
          factor: 'Session Behavior',
          impact: 'Medium Positive',
          score: 88,
          description: 'Consistent and focused completion of verification steps',
          details: ['Time per step: Normal', 'Error rate: Low', 'Completion rate: 100%']
        }
      ]
    },
    risk: {
      title: 'Risk Assessment',
      icon: Shield,
      color: 'nova-green',
      score: 95,
      factors: [
        {
          factor: 'Fraud Indicators',
          impact: 'High Positive',
          score: 98,
          description: 'No suspicious patterns or fraud indicators detected',
          details: ['Known fraud patterns: None found', 'Blacklist check: Clean', 'Velocity rules: Passed']
        },
        {
          factor: 'Data Integrity',
          impact: 'High Positive',
          score: 97,
          description: 'All data points are consistent and verifiable',
          details: ['Cross-reference check: Passed', 'Data consistency: 99.2%', 'Format validation: 100%']
        },
        {
          factor: 'Compliance Score',
          impact: 'Medium Positive',
          score: 91,
          description: 'Meets all regulatory requirements and standards',
          details: ['AML compliance: Passed', 'KYC standards: Met', 'Data privacy: Compliant']
        }
      ]
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High Positive': return 'text-nova-green bg-nova-green-light';
      case 'Medium Positive': return 'text-nova-blue bg-nova-blue-light';
      case 'Low Positive': return 'text-nova-orange bg-nova-orange-light';
      case 'Neutral': return 'text-nova-gray-600 bg-nova-gray-100';
      case 'Negative': return 'text-red-600 bg-red-50';
      default: return 'text-nova-gray-600 bg-nova-gray-100';
    }
  };

  const getOverallRecommendation = () => {
    const avgScore = Object.values(explainabilityData).reduce((sum, section) => sum + section.score, 0) / 4;
    
    if (avgScore >= 95) {
      return {
        status: 'Approved',
        color: 'nova-green',
        icon: CheckCircle,
        message: 'All verification criteria exceeded. Recommended for immediate approval with highest confidence level.'
      };
    } else if (avgScore >= 85) {
      return {
        status: 'Approved with Monitoring',
        color: 'nova-blue',
        icon: Shield,
        message: 'Strong verification results. Approved with standard monitoring protocols.'
      };
    } else {
      return {
        status: 'Review Required',
        color: 'nova-orange',
        icon: AlertTriangle,
        message: 'Some factors require additional review before final approval.'
      };
    }
  };

  const recommendation = getOverallRecommendation();
  const RecommendationIcon = recommendation.icon;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-nova-blue" />
          <h3 className="text-lg font-semibold text-nova-gray-900">AI Decision Explainability</h3>
        </div>
        <div className="text-xs text-nova-gray-500">
          <Clock className="w-3 h-3 inline mr-1" />
          Real-time analysis
        </div>
      </div>

      {/* Overall Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 p-4 rounded-lg border bg-${recommendation.color}-light border-${recommendation.color}`}
      >
        <div className="flex items-center space-x-3">
          <RecommendationIcon className={`w-6 h-6 text-${recommendation.color}`} />
          <div>
            <h4 className={`font-semibold text-${recommendation.color}`}>{recommendation.status}</h4>
            <p className="text-sm text-nova-gray-700 mt-1">{recommendation.message}</p>
          </div>
        </div>
      </motion.div>

      {/* Explainability Sections */}
      <div className="space-y-4">
        {Object.entries(explainabilityData).map(([key, section]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-nova-gray-200 rounded-lg overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-4 bg-nova-gray-50 hover:bg-nova-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <section.icon className={`w-5 h-5 text-${section.color}`} />
                <div className="text-left">
                  <h4 className="font-medium text-nova-gray-900">{section.title}</h4>
                  <p className="text-sm text-nova-gray-600">Score: {section.score}/100</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-nova-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${section.score}%` }}
                    transition={{ duration: 1 }}
                    className={`bg-${section.color} h-2 rounded-full`}
                  />
                </div>
                {expandedSections[key] ? (
                  <ChevronDown className="w-4 h-4 text-nova-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-nova-gray-400" />
                )}
              </div>
            </button>

            {/* Section Content */}
            <AnimatePresence>
              {expandedSections[key] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {section.factors.map((factor, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-3 border border-nova-gray-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-nova-gray-900">{factor.factor}</h5>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(factor.impact)}`}>
                              {factor.impact}
                            </span>
                            <span className="text-sm font-medium text-nova-gray-700">{factor.score}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-nova-gray-600 mb-2">{factor.description}</p>
                        <div className="space-y-1">
                          {factor.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center space-x-2 text-xs text-nova-gray-500">
                              <div className="w-1 h-1 bg-nova-gray-400 rounded-full"></div>
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Audit Trail Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-3 bg-nova-gray-50 rounded-lg border border-nova-gray-200"
      >
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-nova-blue mt-0.5" />
          <div className="text-sm text-nova-gray-600">
            <span className="font-medium">Audit Ready:</span> This analysis provides complete traceability for regulatory compliance. 
            All decision factors are logged and can be reviewed by compliance officers.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExplainabilityCard;
