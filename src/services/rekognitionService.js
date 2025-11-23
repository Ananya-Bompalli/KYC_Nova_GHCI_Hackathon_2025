import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class RekognitionService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${API_BASE_URL}/rekognition`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Start a liveness detection session
   */
  async startLivenessDetection() {
    try {
      const response = await this.apiClient.post('/start-liveness');
      return response.data;
    } catch (error) {
      console.error('Error starting liveness detection:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get liveness detection results
   */
  async getLivenessResults(sessionId) {
    try {
      const response = await this.apiClient.get(`/liveness-results/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting liveness results:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Compare two faces using base64 images
   */
  async compareFaces(sourceImage, targetImage, threshold = 80) {
    try {
      const response = await this.apiClient.post('/compare-faces-base64', {
        sourceImage,
        targetImage,
        threshold
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing faces:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Detect faces in an image
   */
  async detectFaces(imageBase64) {
    try {
      const response = await this.apiClient.post('/detect-faces-base64', {
        image: imageBase64
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting faces:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate image quality for face recognition
   */
  async validateImageQuality(imageBase64) {
    try {
      const response = await this.apiClient.post('/validate-image-quality', {
        image: imageBase64
      });
      return response.data;
    } catch (error) {
      console.error('Error validating image quality:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a face collection
   */
  async createCollection(collectionId) {
    try {
      const response = await this.apiClient.post('/create-collection', {
        collectionId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Index a face to a collection
   */
  async indexFace(imageBase64, collectionId, externalImageId) {
    try {
      const response = await this.apiClient.post('/index-face', {
        image: imageBase64,
        collectionId,
        externalImageId
      });
      return response.data;
    } catch (error) {
      console.error('Error indexing face:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Search for faces in a collection
   */
  async searchFaces(imageBase64, collectionId, threshold = 80, maxFaces = 5) {
    try {
      const response = await this.apiClient.post('/search-faces', {
        image: imageBase64,
        collectionId,
        threshold,
        maxFaces
      });
      return response.data;
    } catch (error) {
      console.error('Error searching faces:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Comprehensive face verification with liveness detection
   */
  async performComprehensiveFaceVerification(liveImage, documentImage) {
    try {
      // Step 1: Validate image quality for both images
      const [liveImageQuality, documentImageQuality] = await Promise.all([
        this.validateImageQuality(liveImage),
        this.validateImageQuality(documentImage)
      ]);

      if (!liveImageQuality.valid) {
        throw new Error(`Live image quality issue: ${liveImageQuality.message}`);
      }

      if (!documentImageQuality.valid) {
        throw new Error(`Document image quality issue: ${documentImageQuality.message}`);
      }

      // Step 2: Detect faces in both images
      const [liveFaces, documentFaces] = await Promise.all([
        this.detectFaces(liveImage),
        this.detectFaces(documentImage)
      ]);

      if (!liveFaces.success || liveFaces.data.faceCount === 0) {
        throw new Error('No faces detected in live image');
      }

      if (!documentFaces.success || documentFaces.data.faceCount === 0) {
        throw new Error('No faces detected in document image');
      }

      if (liveFaces.data.faceCount > 1) {
        throw new Error('Multiple faces detected in live image. Please ensure only one person is visible.');
      }

      if (documentFaces.data.faceCount > 1) {
        throw new Error('Multiple faces detected in document image. Please ensure only one person is visible.');
      }

      // Step 3: Compare faces
      const faceComparison = await this.compareFaces(liveImage, documentImage);

      if (!faceComparison.success) {
        throw new Error('Face comparison failed');
      }

      // Step 4: Compile comprehensive results
      return {
        success: true,
        data: {
          faceMatch: faceComparison.data,
          liveImageAnalysis: {
            quality: liveImageQuality,
            faceDetails: liveFaces.data.faces[0]
          },
          documentImageAnalysis: {
            quality: documentImageQuality,
            faceDetails: documentFaces.data.faces[0]
          },
          overallConfidence: faceComparison.data.confidence,
          recommendation: this.getVerificationRecommendation(faceComparison.data)
        }
      };
    } catch (error) {
      console.error('Error in comprehensive face verification:', error);
      return {
        success: false,
        error: error.message,
        message: 'Comprehensive face verification failed'
      };
    }
  }

  /**
   * Get verification recommendation based on results
   */
  getVerificationRecommendation(faceMatchData) {
    if (!faceMatchData.faceMatch) {
      return {
        status: 'REJECTED',
        reason: 'No face match detected',
        riskLevel: 'HIGH'
      };
    }

    if (faceMatchData.confidence >= 95) {
      return {
        status: 'APPROVED',
        reason: 'High confidence face match',
        riskLevel: 'LOW'
      };
    }

    if (faceMatchData.confidence >= 85) {
      return {
        status: 'APPROVED',
        reason: 'Good confidence face match',
        riskLevel: 'MEDIUM'
      };
    }

    if (faceMatchData.confidence >= 75) {
      return {
        status: 'REVIEW_REQUIRED',
        reason: 'Moderate confidence face match',
        riskLevel: 'MEDIUM'
      };
    }

    return {
      status: 'REJECTED',
      reason: 'Low confidence face match',
      riskLevel: 'HIGH'
    };
  }

  /**
   * Enhanced liveness detection workflow
   */
  async performLivenessDetection() {
    try {
      // Start liveness detection session
      const session = await this.startLivenessDetection();
      
      if (!session.success) {
        throw new Error(session.message || 'Failed to start liveness detection session');
      }

      return {
        success: true,
        sessionId: session.sessionId,
        message: 'Liveness detection session started successfully'
      };
    } catch (error) {
      console.error('Error performing liveness detection:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to perform liveness detection'
      };
    }
  }

  /**
   * Check liveness detection status
   */
  async checkLivenessStatus(sessionId) {
    try {
      const results = await this.getLivenessResults(sessionId);
      
      if (!results.success) {
        throw new Error(results.message || 'Failed to get liveness detection results');
      }

      return {
        success: true,
        data: results.data,
        isComplete: results.data.status === 'SUCCEEDED' || results.data.status === 'FAILED'
      };
    } catch (error) {
      console.error('Error checking liveness status:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to check liveness detection status'
      };
    }
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || error.response.data?.error || 'API request failed');
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response from server. Please check your internet connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Utility function to convert canvas to base64
   */
  static canvasToBase64(canvas, quality = 0.8) {
    return canvas.toDataURL('image/jpeg', quality);
  }

  /**
   * Utility function to convert webcam screenshot to base64
   */
  static webcamScreenshotToBase64(webcamRef, quality = 0.8) {
    if (!webcamRef.current) {
      throw new Error('Webcam reference not available');
    }
    
    return webcamRef.current.getScreenshot({
      width: 640,
      height: 480,
      screenshotFormat: 'image/jpeg',
      screenshotQuality: quality
    });
  }

  /**
   * Validate base64 image format
   */
  static validateBase64Image(base64String) {
    if (!base64String) {
      return { valid: false, message: 'No image data provided' };
    }

    if (!base64String.startsWith('data:image/')) {
      return { valid: false, message: 'Invalid image format' };
    }

    // Check if it's a supported format
    const supportedFormats = ['jpeg', 'jpg', 'png'];
    const formatMatch = base64String.match(/data:image\/([a-zA-Z]+);base64,/);
    
    if (!formatMatch || !supportedFormats.includes(formatMatch[1].toLowerCase())) {
      return { valid: false, message: 'Unsupported image format. Please use JPEG or PNG.' };
    }

    // Check approximate size (base64 is ~4/3 the size of original)
    const sizeInBytes = (base64String.length * 3) / 4;
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    
    if (sizeInBytes > maxSizeInBytes) {
      return { valid: false, message: 'Image size too large. Please use an image under 10MB.' };
    }

    return { valid: true, message: 'Image format is valid' };
  }
}

export default RekognitionService;
