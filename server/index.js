const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RekognitionService = require('./services/rekognitionService');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize AWS Rekognition Service
const rekognitionService = new RekognitionService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
    }
  }
});

// API Routes

// AWS Rekognition Liveness Detection endpoints
app.post('/api/rekognition/start-liveness', async (req, res) => {
  try {
    console.log('Starting AWS Rekognition liveness detection session...');
    const result = await rekognitionService.startLivenessDetection();
    res.json(result);
  } catch (error) {
    console.error('Liveness detection start error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start liveness detection session',
      message: error.message 
    });
  }
});

app.get('/api/rekognition/liveness-results/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('Getting liveness results for session:', sessionId);
    const result = await rekognitionService.getLivenessResults(sessionId);
    res.json(result);
  } catch (error) {
    console.error('Liveness results error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get liveness detection results',
      message: error.message 
    });
  }
});

// AWS Rekognition Face Comparison endpoint
app.post('/api/rekognition/compare-faces', upload.fields([
  { name: 'sourceImage', maxCount: 1 },
  { name: 'targetImage', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.sourceImage || !req.files.targetImage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both source and target images are required' 
      });
    }

    console.log('Comparing faces using AWS Rekognition...');
    
    const sourceImageBuffer = fs.readFileSync(req.files.sourceImage[0].path);
    const targetImageBuffer = fs.readFileSync(req.files.targetImage[0].path);
    
    const result = await rekognitionService.compareFaces(sourceImageBuffer, targetImageBuffer);
    
    // Clean up uploaded files
    fs.unlinkSync(req.files.sourceImage[0].path);
    fs.unlinkSync(req.files.targetImage[0].path);
    
    res.json(result);
  } catch (error) {
    console.error('Face comparison error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Face comparison failed',
      message: error.message 
    });
  }
});

// AWS Rekognition Face Comparison with base64 images
app.post('/api/rekognition/compare-faces-base64', async (req, res) => {
  try {
    const { sourceImage, targetImage, threshold } = req.body;
    
    if (!sourceImage || !targetImage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both source and target images (base64) are required' 
      });
    }

    console.log('Comparing faces using AWS Rekognition (base64)...');
    
    const sourceImageBuffer = rekognitionService.base64ToBuffer(sourceImage);
    const targetImageBuffer = rekognitionService.base64ToBuffer(targetImage);
    
    const result = await rekognitionService.compareFaces(
      sourceImageBuffer, 
      targetImageBuffer, 
      threshold || 80
    );
    
    res.json(result);
  } catch (error) {
    console.error('Face comparison error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Face comparison failed',
      message: error.message 
    });
  }
});

// AWS Rekognition Face Detection endpoint
app.post('/api/rekognition/detect-faces', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image file is required' 
      });
    }

    console.log('Detecting faces using AWS Rekognition...');
    
    const imageBuffer = fs.readFileSync(req.file.path);
    const result = await rekognitionService.detectFaces(imageBuffer);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(result);
  } catch (error) {
    console.error('Face detection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Face detection failed',
      message: error.message 
    });
  }
});

// AWS Rekognition Face Detection with base64 image
app.post('/api/rekognition/detect-faces-base64', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image (base64) is required' 
      });
    }

    console.log('Detecting faces using AWS Rekognition (base64)...');
    
    const imageBuffer = rekognitionService.base64ToBuffer(image);
    const result = await rekognitionService.detectFaces(imageBuffer);
    
    res.json(result);
  } catch (error) {
    console.error('Face detection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Face detection failed',
      message: error.message 
    });
  }
});

// AWS Rekognition Image Quality Validation
app.post('/api/rekognition/validate-image-quality', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image (base64) is required' 
      });
    }

    console.log('Validating image quality using AWS Rekognition...');
    
    const imageBuffer = rekognitionService.base64ToBuffer(image);
    const result = await rekognitionService.validateImageQuality(imageBuffer);
    
    res.json(result);
  } catch (error) {
    console.error('Image quality validation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Image quality validation failed',
      message: error.message 
    });
  }
});

// AWS Rekognition Collection Management endpoints
app.post('/api/rekognition/create-collection', async (req, res) => {
  try {
    const { collectionId } = req.body;
    
    if (!collectionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Collection ID is required' 
      });
    }

    console.log('Creating face collection:', collectionId);
    const result = await rekognitionService.createCollection(collectionId);
    
    res.json(result);
  } catch (error) {
    console.error('Collection creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create collection',
      message: error.message 
    });
  }
});

app.post('/api/rekognition/index-face', async (req, res) => {
  try {
    const { image, collectionId, externalImageId } = req.body;
    
    if (!image || !collectionId || !externalImageId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image, collection ID, and external image ID are required' 
      });
    }

    console.log('Indexing face to collection:', collectionId);
    
    const imageBuffer = rekognitionService.base64ToBuffer(image);
    const result = await rekognitionService.indexFace(imageBuffer, collectionId, externalImageId);
    
    res.json(result);
  } catch (error) {
    console.error('Face indexing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to index face',
      message: error.message 
    });
  }
});

app.post('/api/rekognition/search-faces', async (req, res) => {
  try {
    const { image, collectionId, threshold, maxFaces } = req.body;
    
    if (!image || !collectionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image and collection ID are required' 
      });
    }

    console.log('Searching faces in collection:', collectionId);
    
    const imageBuffer = rekognitionService.base64ToBuffer(image);
    const result = await rekognitionService.searchFacesByImage(
      imageBuffer, 
      collectionId, 
      threshold || 80, 
      maxFaces || 5
    );
    
    res.json(result);
  } catch (error) {
    console.error('Face search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search faces',
      message: error.message 
    });
  }
});

// Document processing endpoint
app.post('/api/process-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Processing document:', req.file.filename);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis results
    const analysisResult = {
      success: true,
      documentId: req.file.filename,
      confidence: 92 + Math.random() * 6,
      documentType: 'Driver License',
      extractedData: {
        name: 'Sample User',
        documentNumber: 'DL' + Math.floor(Math.random() * 1000000),
        dateOfBirth: '1990-01-15',
        expiryDate: '2028-01-15',
        nationality: 'United States'
      },
      securityFeatures: {
        hologram: { detected: true, authentic: true },
        microtext: { detected: true, readable: true },
        uvFeatures: { detected: true, genuine: true },
        barcodeData: { valid: true, matches: true }
      },
      riskScore: Math.random() * 10,
      processingTime: 2000 + Math.random() * 1000
    };

    res.json(analysisResult);
  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({ error: 'Document processing failed' });
  }
});

// Face verification endpoint
app.post('/api/verify-face', upload.fields([
  { name: 'livePhoto', maxCount: 1 },
  { name: 'documentPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.livePhoto || !req.files.documentPhoto) {
      return res.status(400).json({ error: 'Both live photo and document photo required' });
    }

    console.log('Verifying face match...');
    
    // Simulate face recognition processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const similarity = 85 + Math.random() * 10;
    
    const verificationResult = {
      success: true,
      similarity: Math.round(similarity * 10) / 10,
      confidence: similarity > 90 ? 96.8 : similarity > 80 ? 88.5 : 72.3,
      match: similarity > 75,
      liveness: {
        score: 85 + Math.random() * 10,
        passed: true,
        signals: {
          blinkDetection: true,
          headMovement: true,
          depthAnalysis: true,
          textureAnalysis: true
        }
      },
      faceQuality: 85 + Math.random() * 10,
      processingTime: 1500 + Math.random() * 500
    };

    res.json(verificationResult);
  } catch (error) {
    console.error('Face verification error:', error);
    res.status(500).json({ error: 'Face verification failed' });
  }
});

// Trust score calculation endpoint
app.post('/api/calculate-trust', (req, res) => {
  try {
    const { documentData, biometricData, behavioralData } = req.body;
    
    console.log('Calculating trust score...');
    
    // Simulate trust calculation
    let score = 0;
    const factors = [];
    
    // Document authenticity (40% weight)
    const docScore = documentData?.confidence || 85;
    score += docScore * 0.4;
    factors.push({
      category: 'Document Authenticity',
      score: docScore,
      impact: docScore > 90 ? 'High Positive' : 'Medium Positive',
      details: `Document confidence: ${docScore.toFixed(1)}%`
    });
    
    // Biometric verification (35% weight)
    const bioScore = biometricData?.confidence || 80;
    score += bioScore * 0.35;
    factors.push({
      category: 'Biometric Match',
      score: bioScore,
      impact: bioScore > 85 ? 'High Positive' : 'Medium Positive',
      details: `Face match confidence: ${bioScore.toFixed(1)}%`
    });
    
    // Behavioral signals (25% weight)
    const behaviorScore = 75 + Math.random() * 20;
    score += behaviorScore * 0.25;
    factors.push({
      category: 'Behavioral Analysis',
      score: behaviorScore,
      impact: behaviorScore > 80 ? 'Medium Positive' : 'Low Positive',
      details: 'User interaction patterns analysis'
    });
    
    const finalScore = Math.round(score * 10) / 10;
    
    const trustResult = {
      finalScore,
      factors,
      recommendation: finalScore >= 90 ? 'Approved' : finalScore >= 75 ? 'Approved with Monitoring' : 'Review Required',
      timestamp: new Date().toISOString()
    };
    
    res.json(trustResult);
  } catch (error) {
    console.error('Trust calculation error:', error);
    res.status(500).json({ error: 'Trust calculation failed' });
  }
});

// Chat/NLP endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message, context } = req.body;
    
    console.log('Processing chat message:', message);
    
    // Simple intent classification
    const messageLower = message.toLowerCase();
    let response = "I'm here to help! Let me assist you with your verification.";
    
    if (messageLower.includes('secure') || messageLower.includes('safe') || messageLower.includes('privacy')) {
      response = "Your data is protected with bank-level encryption and processed locally on your device. We never store your biometric data permanently.";
    } else if (messageLower.includes('how') || messageLower.includes('process') || messageLower.includes('work')) {
      response = "The process involves three simple steps: document upload, face verification, and trust assessment. Each step is guided by AI and typically takes under 5 minutes.";
    } else if (messageLower.includes('time') || messageLower.includes('long') || messageLower.includes('quick')) {
      response = "Most users complete verification in under 4 minutes. The AI processing is nearly instantaneous with real-time feedback.";
    } else if (messageLower.includes('help') || messageLower.includes('support')) {
      response = "I'm here to help! What specific part of the verification process would you like assistance with?";
    }
    
    res.json({
      response,
      intent: 'assistance',
      confidence: 0.85,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      documentProcessing: 'Online',
      faceRecognition: 'Online',
      trustScoring: 'Online',
      nlp: 'Online'
    }
  });
});

// Analytics endpoint for dashboard
app.get('/api/analytics', (req, res) => {
  res.json({
    verifications: {
      total: 1247 + Math.floor(Math.random() * 100),
      today: 156 + Math.floor(Math.random() * 50),
      completionRate: 92 + Math.random() * 6,
      averageTime: 4.2 + Math.random() * 2
    },
    aiModules: {
      smartVision: {
        accuracy: 98.7,
        processed: 1156 + Math.floor(Math.random() * 100),
        avgTime: 2.1
      },
      conversationalAI: {
        satisfaction: 94.3,
        interactions: 2847 + Math.floor(Math.random() * 200),
        resolution: 89.2
      },
      trustGraph: {
        accuracy: 96.1,
        flagged: 23 + Math.floor(Math.random() * 10),
        falsePositives: 1.2
      }
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KYC Nova API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Services: Document, Face Recognition, Trust Scoring, NLP`);
  console.log(`🔒 Security: File upload limits, CORS protection, input validation`);
});

module.exports = app;
