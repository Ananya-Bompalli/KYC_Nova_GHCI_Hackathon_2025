import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User, 
  CreditCard, 
  Shield,
  Brain,
  Award,
  FileCheck,
  Clock,
  MapPin,
  Calendar,
  Hash,
  Eye,
  RefreshCw,
  Download,
  ArrowRight
} from 'lucide-react';

const VerificationResults = ({ personalDetails, aadhaarData, livenessResult, onComplete, onRetry }) => {
  const [overallResult, setOverallResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [matchResults, setMatchResults] = useState({});

  useEffect(() => {
    processVerificationData();
  }, [personalDetails, aadhaarData, livenessResult]);

  const processVerificationData = async () => {
    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Compare provided data with Aadhaar extracted data
    const nameMatch = compareNames(personalDetails.personalDetails.name, aadhaarData.aadhaarData.name);
    const dobMatch = compareDOB(personalDetails.personalDetails.dateOfBirth, aadhaarData.aadhaarData.dateOfBirth);
    const addressMatch = compareAddresses(personalDetails.personalDetails.address, aadhaarData.aadhaarData.address);
    
    const matches = {
      name: nameMatch,
      dateOfBirth: dobMatch,
      address: addressMatch,
      liveness: livenessResult.success,
      document: aadhaarData.scanMetadata.confidence > 85
    };
    
    setMatchResults(matches);
    
    // Calculate overall result
    const totalMatches = Object.values(matches).filter(Boolean).length;
    const matchPercentage = (totalMatches / Object.keys(matches).length) * 100;
    
    const result = {
      success: matchPercentage >= 80 && matches.liveness && matches.document,
      overallScore: matchPercentage,
      trustScore: calculateTrustScore(matches, livenessResult, aadhaarData),
      riskLevel: calculateRiskLevel(matchPercentage, matches),
      recommendation: matchPercentage >= 80 && matches.liveness && matches.document ? 'APPROVED' : 'REJECTED',
      details: {
        matchPercentage,
        totalMatches,
        possibleMatches: Object.keys(matches).length,
        livenessConfidence: livenessResult.confidence,
        documentConfidence: aadhaarData.scanMetadata.confidence,
        processingTime: Date.now(),
        verificationId: generateVerificationId()
      }
    };
    
    setOverallResult(result);
    setIsAnalyzing(false);
    
    // Pass results to parent for trust score calculation
    if (onComplete) {
      onComplete(result);
    }
  };

  const compareNames = (provided, extracted) => {
    const normalize = (name) => name.toLowerCase().trim().replace(/\s+/g, ' ');
    const providedNorm = normalize(provided);
    const extractedNorm = normalize(extracted);
    
    // Exact match or contains match for names
    return providedNorm === extractedNorm || 
           providedNorm.includes(extractedNorm) || 
           extractedNorm.includes(providedNorm);
  };

  const compareDOB = (provided, extracted) => {
    // Convert formats for comparison
    // Provided is YYYY-MM-DD, extracted is DD/MM/YYYY
    const providedDate = new Date(provided);
    const extractedParts = extracted.split('/'); // DD/MM/YYYY format
    const extractedDate = new Date(extractedParts[2], extractedParts[1] - 1, extractedParts[0]);
    
    // Compare year, month, and day separately to handle format differences
    return providedDate.getFullYear() === extractedDate.getFullYear() &&
           providedDate.getMonth() === extractedDate.getMonth() &&
           providedDate.getDate() === extractedDate.getDate();
  };

  const compareAddresses = (provided, extracted) => {
    const normalize = (addr) => addr.toLowerCase().trim().replace(/[,\.]/g, '').replace(/\s+/g, ' ');
    const providedNorm = normalize(provided);
    const extractedNorm = normalize(extracted);
    
    // Check for common elements in addresses
    const providedWords = providedNorm.split(' ');
    const extractedWords = extractedNorm.split(' ');
    
    const commonWords = providedWords.filter(word => 
      word.length > 2 && extractedWords.includes(word)
    );
    
    return commonWords.length >= 2; // At least 2 common significant words
  };

  const calculateTrustScore = (matches, livenessResult, aadhaarData) => {
    let score = 0;
    
    // Base score from matches (60 points)
    const matchCount = Object.values(matches).filter(Boolean).length;
    score += (matchCount / Object.keys(matches).length) * 60;
    
    // Liveness confidence (25 points)
    score += (livenessResult.confidence / 100) * 25;
    
    // Document confidence (15 points)
    score += (aadhaarData.scanMetadata.confidence / 100) * 15;
    
    return Math.round(score);
  };

  const calculateRiskLevel = (matchPercentage, matches) => {
    if (!matches.liveness || !matches.document) return 'CRITICAL';
    if (matchPercentage < 60) return 'HIGH';
    if (matchPercentage < 80) return 'MEDIUM';
    return 'LOW';
  };

  const generateVerificationId = () => {
    return `KYC-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const getMatchIcon = (isMatch) => {
    return isMatch ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-orange-600';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-nova-gray-900">
              Processing Verification Results
            </h2>
            <p className="text-nova-gray-600 mt-1">
              Analyzing and comparing all collected information
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-nova-purple" />
            <span className="text-sm font-medium text-nova-purple">Step 4 of 4</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-nova-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-3 border-nova-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-nova-gray-900 mb-4">
            Analyzing Verification Data
          </h3>
          <p className="text-nova-gray-600 mb-8 max-w-md mx-auto">
            Comparing personal details, document information, and biometric verification results
          </p>

          <div className="space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between p-3 bg-nova-gray-50 rounded-lg">
              <div className="flex items-center">
                <User className="w-5 h-5 text-nova-purple mr-3" />
                <span className="text-sm font-medium text-nova-gray-900">Personal Details</span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-nova-gray-50 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-nova-purple mr-3" />
                <span className="text-sm font-medium text-nova-gray-900">Document Scan</span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-nova-gray-50 rounded-lg">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-nova-purple mr-3" />
                <span className="text-sm font-medium text-nova-gray-900">Liveness Detection</span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-900">Cross-Verification</span>
              </div>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-nova-gray-900">
            KYC Verification Results
          </h2>
          <p className="text-nova-gray-600 mt-1">
            Complete analysis of your identity verification
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-nova-purple" />
          <span className="text-sm font-medium text-nova-purple">Step 4 of 4</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Overall Result */}
        <div className="text-center">
          {overallResult.success ? (
            <>
              <Award className="w-20 h-20 text-nova-green mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-nova-gray-900 mb-2">
                Verification Successful
              </h3>
              <p className="text-nova-gray-600 text-lg">
                Identity successfully verified with high confidence
              </p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-nova-gray-900 mb-2">
                Verification Failed
              </h3>
              <p className="text-nova-gray-600 text-lg">
                Unable to verify identity - please review details and try again
              </p>
            </>
          )}
        </div>

        {/* Trust Score */}
        <div className={`rounded-lg p-6 ${
          overallResult.success 
            ? 'bg-gradient-to-r from-nova-green-light to-nova-blue-light' 
            : 'bg-gradient-to-r from-red-50 to-orange-50'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-nova-gray-900">Trust Score</h4>
            <div className="text-right">
              <div className={`text-4xl font-bold ${
                overallResult.trustScore >= 80 ? 'text-nova-green' : 
                overallResult.trustScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {overallResult.trustScore}
              </div>
              <div className="text-sm text-nova-gray-600">out of 100</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-nova-gray-600">Match Rate</p>
              <p className="text-lg font-bold text-nova-purple">
                {overallResult.details.matchPercentage.toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-nova-gray-600">Risk Level</p>
              <p className={`text-lg font-bold ${getRiskColor(overallResult.riskLevel)}`}>
                {overallResult.riskLevel}
              </p>
            </div>
            <div className="text-center">
              <p className="text-nova-gray-600">Status</p>
              <p className={`text-lg font-bold ${
                overallResult.success ? 'text-nova-green' : 'text-red-600'
              }`}>
                {overallResult.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Data Comparison */}
        <div className="bg-nova-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-bold text-nova-gray-900 mb-4">Data Verification</h4>
          
          <div className="space-y-4">
            {/* Name Match */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                {getMatchIcon(matchResults.name)}
                <div className="ml-3">
                  <p className="font-medium text-nova-gray-900">Name Verification</p>
                  <p className="text-sm text-nova-gray-600">
                    Provided: {personalDetails.personalDetails.name} | Document: {aadhaarData.aadhaarData.name}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                matchResults.name ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {matchResults.name ? 'Match' : 'Mismatch'}
              </div>
            </div>

            {/* Date of Birth Match */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                {getMatchIcon(matchResults.dateOfBirth)}
                <div className="ml-3">
                  <p className="font-medium text-nova-gray-900">Date of Birth Verification</p>
                  <p className="text-sm text-nova-gray-600">
                    Provided: {personalDetails.personalDetails.dateOfBirth} | Document: {aadhaarData.aadhaarData.dateOfBirth}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                matchResults.dateOfBirth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {matchResults.dateOfBirth ? 'Match' : 'Mismatch'}
              </div>
            </div>

            {/* Address Match */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                {getMatchIcon(matchResults.address)}
                <div className="ml-3">
                  <p className="font-medium text-nova-gray-900">Address Verification</p>
                  <p className="text-sm text-nova-gray-600">
                    Comparing provided address with document address
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                matchResults.address ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {matchResults.address ? 'Match' : 'Mismatch'}
              </div>
            </div>

            {/* Liveness Check */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                {getMatchIcon(matchResults.liveness)}
                <div className="ml-3">
                  <p className="font-medium text-nova-gray-900">Liveness Verification</p>
                  <p className="text-sm text-nova-gray-600">
                    Confidence: {livenessResult.confidence}% | {livenessResult.reason}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                matchResults.liveness ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {matchResults.liveness ? 'Passed' : 'Failed'}
              </div>
            </div>

            {/* Document Authenticity */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                {getMatchIcon(matchResults.document)}
                <div className="ml-3">
                  <p className="font-medium text-nova-gray-900">Document Authenticity</p>
                  <p className="text-sm text-nova-gray-600">
                    Extraction Confidence: {aadhaarData.scanMetadata.confidence}%
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                matchResults.document ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {matchResults.document ? 'Verified' : 'Failed'}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Details */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">Verification Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Verification ID:</p>
              <p className="font-mono text-blue-900">{overallResult.details.verificationId}</p>
            </div>
            <div>
              <p className="text-blue-700">Processing Time:</p>
              <p className="font-medium text-blue-900">
                {new Date(overallResult.details.processingTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-blue-700">Total Checks:</p>
              <p className="font-medium text-blue-900">
                {overallResult.details.totalMatches}/{overallResult.details.possibleMatches} passed
              </p>
            </div>
            <div>
              <p className="text-blue-700">Overall Score:</p>
              <p className="font-medium text-blue-900">
                {overallResult.overallScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onRetry}
            className="btn-secondary inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start Over
          </button>
          
          <div className="flex space-x-4">
            <button
              className="btn-secondary inline-flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {/* Next Steps */}
        {overallResult.success ? (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">✓ Verification Complete</h4>
            <p className="text-sm text-green-700">
              Your identity has been successfully verified. You can now proceed with your application or account setup.
            </p>
          </div>
        ) : (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">⚠ Verification Failed</h4>
            <p className="text-sm text-red-700">
              Please review the mismatched information and try again. Ensure all details match your official documents exactly.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerificationResults;
