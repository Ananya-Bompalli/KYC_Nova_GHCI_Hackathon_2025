import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  User, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  Shield,
  Loader,
  Play,
  Square,
  Zap,
  Settings
} from 'lucide-react';
import LivenessDetection from './LivenessDetection';

const FaceVerification = ({ onComplete, documentImage, useAWSRekognition = true }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [livenessStep, setLivenessStep] = useState('');
  const [useAdvancedMode, setUseAdvancedMode] = useState(useAWSRekognition);
  const webcamRef = useRef(null);

  const livenessInstructions = [
    { id: 'center', instruction: 'Look straight at the camera', duration: 2000 },
    { id: 'blink', instruction: 'Please blink naturally', duration: 2000 },
    { id: 'left', instruction: 'Turn your head slightly left', duration: 2000 },
    { id: 'right', instruction: 'Turn your head slightly right', duration: 2000 },
    { id: 'complete', instruction: 'Perfect! Processing...', duration: 1000 }
  ];

  const startWebcam = () => {
    setIsWebcamActive(true);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsWebcamActive(false);
    performLivenessCheck();
  }, [webcamRef]);

  const performLivenessCheck = async () => {
    setIsProcessing(true);
    
    // Simulate liveness detection steps
    for (let i = 0; i < livenessInstructions.length; i++) {
      const step = livenessInstructions[i];
      setLivenessStep(step.id);
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Simulate face matching
    setTimeout(() => {
      const mockResult = {
        faceMatch: {
          confidence: 96.8,
          similarity: 97.2,
          status: 'MATCH'
        },
        livenessCheck: {
          passed: true,
          confidence: 94.5,
          signals: {
            blinkDetection: true,
            headMovement: true,
            depthAnalysis: true,
            textureAnalysis: true
          }
        },
        biometricAnalysis: {
          faceQuality: 98.1,
          eyesVisible: true,
          mouthVisible: true,
          noObstructions: true
        },
        riskAssessment: {
          spoofingRisk: 1.2,
          deepfakeRisk: 0.8,
          overallRisk: 'LOW'
        }
      };

      setVerificationResult(mockResult);
      setIsProcessing(false);
      
      // Complete after showing results
      setTimeout(() => {
        onComplete(mockResult);
      }, 3000);
    }, 1000);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setIsProcessing(false);
    setLivenessStep('');
    setIsWebcamActive(true);
  };

  const getCurrentInstruction = () => {
    const step = livenessInstructions.find(s => s.id === livenessStep);
    return step?.instruction || '';
  };

  // Use AWS Rekognition component if advanced mode is enabled
  if (useAdvancedMode) {
    return <LivenessDetection onComplete={onComplete} documentImage={documentImage} />;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-nova-gray-900">Face Verification</h2>
          <p className="text-nova-gray-600 mt-1">
            Verify your identity with biometric matching and liveness detection
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setUseAdvancedMode(!useAdvancedMode)}
              className={`p-2 rounded-lg transition-colors ${
                useAdvancedMode 
                  ? 'bg-nova-purple text-white' 
                  : 'bg-nova-gray-100 text-nova-gray-600 hover:bg-nova-gray-200'
              }`}
              title={useAdvancedMode ? 'Switch to Standard Mode' : 'Switch to AWS Rekognition Mode'}
            >
              {useAdvancedMode ? <Zap className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-nova-purple" />
            <span className="text-sm font-medium text-nova-purple">
              {useAdvancedMode ? 'AWS AI' : 'Biometric AI'}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Info Banner */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <Settings className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-sm text-blue-700">
            Currently using <strong>Standard Mode</strong>. 
            <button 
              onClick={() => setUseAdvancedMode(true)}
              className="ml-1 underline hover:no-underline"
            >
              Switch to AWS Rekognition
            </button> for enhanced liveness detection.
          </p>
        </div>
      </div>

      {!isWebcamActive && !capturedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-nova-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-nova-purple" />
          </div>
          <h3 className="text-xl font-semibold text-nova-gray-900 mb-4">
            Ready for Face Verification
          </h3>
          <p className="text-nova-gray-600 mb-8 max-w-md mx-auto">
            We'll use your device camera to verify that you're the same person in your ID document. 
            This includes liveness detection to ensure security.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <Eye className="w-6 h-6 text-nova-purple mx-auto mb-2" />
              <p className="text-sm text-nova-gray-600">Face Matching</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-nova-purple mx-auto mb-2" />
              <p className="text-sm text-nova-gray-600">Liveness Check</p>
            </div>
            <div className="text-center">
              <User className="w-6 h-6 text-nova-purple mx-auto mb-2" />
              <p className="text-sm text-nova-gray-600">Biometric Analysis</p>
            </div>
          </div>

          <button
            onClick={startWebcam}
            className="btn-primary inline-flex items-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Face Verification
          </button>
          
          <div className="mt-4 text-sm text-nova-gray-500">
            Your camera data is processed locally and never stored
          </div>
        </motion.div>
      )}

      {isWebcamActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full max-w-md mx-auto rounded-lg"
              mirrored={true}
            />
            
            {/* Face overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-60 border-2 border-nova-purple rounded-lg bg-transparent">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-nova-purple"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-nova-purple"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-nova-purple"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-nova-purple"></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-nova-gray-900 mb-4">
              Position your face within the frame
            </p>
            <p className="text-nova-gray-600 mb-6">
              Make sure your face is clearly visible and well-lit
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsWebcamActive(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="btn-primary inline-flex items-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {capturedImage && isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-48 h-48 object-cover rounded-lg"
            />
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-nova-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-6 h-6 text-nova-purple animate-spin" />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={livenessStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <h3 className="text-lg font-semibold text-nova-gray-900">
                  {livenessStep === 'complete' ? 'Verification Complete' : 'Liveness Detection'}
                </h3>
                <p className="text-nova-gray-600">
                  {getCurrentInstruction()}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="mt-6">
              <div className="w-full bg-nova-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(livenessInstructions.findIndex(s => s.id === livenessStep) + 1) / livenessInstructions.length * 100}%` 
                  }}
                  className="bg-nova-purple h-2 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {verificationResult && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-nova-green mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-nova-gray-900 mb-2">
              Face Verification Successful
            </h3>
            <p className="text-nova-gray-600">
              Your identity has been verified with high confidence
            </p>
          </div>

          {/* Verification Results */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-nova-gray-900">Face Match Results</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-nova-gray-600">Confidence</span>
                  <span className="font-medium text-nova-green">
                    {verificationResult.faceMatch.confidence}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-nova-gray-600">Similarity</span>
                  <span className="font-medium text-nova-green">
                    {verificationResult.faceMatch.similarity}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-nova-gray-600">Status</span>
                  <span className="px-2 py-1 bg-nova-green-light text-nova-green text-xs rounded-full font-medium">
                    {verificationResult.faceMatch.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-nova-gray-900">Liveness Check</h4>
              <div className="space-y-2">
                {Object.entries(verificationResult.livenessCheck.signals).map(([signal, passed]) => (
                  <div key={signal} className="flex items-center justify-between">
                    <span className="text-sm text-nova-gray-600 capitalize">
                      {signal.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <CheckCircle className="w-4 h-4 text-nova-green" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-nova-green-light rounded-lg p-4">
            <h4 className="font-semibold text-nova-green mb-2">Security Assessment</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-nova-gray-600">Spoofing Risk</p>
                <p className="font-bold text-nova-green">
                  {verificationResult.riskAssessment.spoofingRisk}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-nova-gray-600">Deepfake Risk</p>
                <p className="font-bold text-nova-green">
                  {verificationResult.riskAssessment.deepfakeRisk}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-nova-gray-600">Overall Risk</p>
                <p className="font-bold text-nova-green">
                  {verificationResult.riskAssessment.overallRisk}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={retakePhoto}
              className="btn-secondary inline-flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Photo
            </button>
            <button
              onClick={() => onComplete(verificationResult)}
              className="btn-primary"
            >
              Continue to Trust Assessment
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FaceVerification;
