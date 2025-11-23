const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class RekognitionService {
  constructor() {
    // Configure AWS SDK - in production, use IAM roles or environment variables
    try {
      this.rekognition = new AWS.Rekognition({
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });
      
      // Validate AWS credentials are configured
      this.isConfigured = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
      
      if (!this.isConfigured) {
        console.warn('AWS Rekognition credentials not configured. Service will operate in mock mode.');
      }
    } catch (error) {
      console.error('Failed to initialize AWS Rekognition service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Check if AWS Rekognition is properly configured
   */
  isAWSConfigured() {
    return this.isConfigured;
  }

  /**
   * Validate AWS credentials by making a test call
   */
  async validateCredentials() {
    if (!this.isConfigured) {
      return {
        valid: false,
        message: 'AWS credentials not configured'
      };
    }

    try {
      // Make a simple call to validate credentials
      await this.rekognition.listCollections({ MaxResults: 1 }).promise();
      return {
        valid: true,
        message: 'AWS credentials are valid'
      };
    } catch (error) {
      console.error('AWS credentials validation failed:', error);
      return {
        valid: false,
        message: `AWS credentials validation failed: ${error.message}`
      };
    }
  }

  /**
   * Start a liveness detection session
   */
  async startLivenessDetection() {
    try {
      const params = {
        Settings: {
          OutputConfig: {
            S3Bucket: process.env.REKOGNITION_S3_BUCKET || 'rekognition-liveness-bucket'
          },
          AuditImagesLimit: 4
        }
      };

      const result = await this.rekognition.createFaceLivenessSession(params).promise();
      
      return {
        success: true,
        sessionId: result.SessionId,
        message: 'Liveness detection session started successfully'
      };
    } catch (error) {
      console.error('Error starting liveness detection:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to start liveness detection session'
      };
    }
  }

  /**
   * Get liveness detection results
   */
  async getLivenessResults(sessionId) {
    try {
      const params = {
        SessionId: sessionId
      };

      const result = await this.rekognition.getFaceLivenessSessionResults(params).promise();
      
      return {
        success: true,
        data: {
          sessionId: result.SessionId,
          status: result.Status,
          confidence: result.Confidence,
          auditImages: result.AuditImages,
          referenceImage: result.ReferenceImage
        }
      };
    } catch (error) {
      console.error('Error getting liveness results:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get liveness detection results'
      };
    }
  }

  /**
   * Compare faces between two images
   */
  async compareFaces(sourceImageBuffer, targetImageBuffer, threshold = 80) {
    try {
      const params = {
        SourceImage: {
          Bytes: sourceImageBuffer
        },
        TargetImage: {
          Bytes: targetImageBuffer
        },
        SimilarityThreshold: threshold
      };

      const result = await this.rekognition.compareFaces(params).promise();
      
      if (result.FaceMatches && result.FaceMatches.length > 0) {
        const match = result.FaceMatches[0];
        return {
          success: true,
          data: {
            faceMatch: true,
            confidence: match.Similarity,
            boundingBox: match.Face.BoundingBox,
            landmarks: match.Face.Landmarks,
            quality: match.Face.Quality,
            emotions: match.Face.Emotions,
            ageRange: match.Face.AgeRange,
            gender: match.Face.Gender
          }
        };
      } else {
        return {
          success: true,
          data: {
            faceMatch: false,
            confidence: 0,
            message: 'No matching faces found'
          }
        };
      }
    } catch (error) {
      console.error('Error comparing faces:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to compare faces'
      };
    }
  }

  /**
   * Detect faces in an image
   */
  async detectFaces(imageBuffer) {
    try {
      const params = {
        Image: {
          Bytes: imageBuffer
        },
        Attributes: ['ALL']
      };

      const result = await this.rekognition.detectFaces(params).promise();
      
      return {
        success: true,
        data: {
          faceCount: result.FaceDetails.length,
          faces: result.FaceDetails.map(face => ({
            boundingBox: face.BoundingBox,
            confidence: face.Confidence,
            landmarks: face.Landmarks,
            quality: face.Quality,
            emotions: face.Emotions,
            ageRange: face.AgeRange,
            gender: face.Gender,
            eyesOpen: face.EyesOpen,
            mouthOpen: face.MouthOpen,
            mustache: face.Mustache,
            beard: face.Beard,
            eyeglasses: face.Eyeglasses,
            sunglasses: face.Sunglasses,
            smile: face.Smile
          }))
        }
      };
    } catch (error) {
      console.error('Error detecting faces:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to detect faces'
      };
    }
  }

  /**
   * Detect labels (objects, scenes) in an image
   */
  async detectLabels(imageBuffer) {
    try {
      const params = {
        Image: {
          Bytes: imageBuffer
        },
        MaxLabels: 10,
        MinConfidence: 75
      };

      const result = await this.rekognition.detectLabels(params).promise();
      
      return {
        success: true,
        data: {
          labels: result.Labels.map(label => ({
            name: label.Name,
            confidence: label.Confidence,
            categories: label.Categories,
            instances: label.Instances
          }))
        }
      };
    } catch (error) {
      console.error('Error detecting labels:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to detect labels'
      };
    }
  }

  /**
   * Search for faces in a collection
   */
  async searchFacesByImage(imageBuffer, collectionId, threshold = 80, maxFaces = 5) {
    try {
      const params = {
        CollectionId: collectionId,
        Image: {
          Bytes: imageBuffer
        },
        FaceMatchThreshold: threshold,
        MaxFaces: maxFaces
      };

      const result = await this.rekognition.searchFacesByImage(params).promise();
      
      return {
        success: true,
        data: {
          faceMatches: result.FaceMatches.map(match => ({
            similarity: match.Similarity,
            face: {
              faceId: match.Face.FaceId,
              boundingBox: match.Face.BoundingBox,
              confidence: match.Face.Confidence,
              externalImageId: match.Face.ExternalImageId
            }
          })),
          searchedFaceBoundingBox: result.SearchedFaceBoundingBox,
          searchedFaceConfidence: result.SearchedFaceConfidence
        }
      };
    } catch (error) {
      console.error('Error searching faces:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to search faces in collection'
      };
    }
  }

  /**
   * Create a face collection
   */
  async createCollection(collectionId) {
    try {
      const params = {
        CollectionId: collectionId
      };

      const result = await this.rekognition.createCollection(params).promise();
      
      return {
        success: true,
        data: {
          collectionArn: result.CollectionArn,
          faceModelVersion: result.FaceModelVersion,
          statusCode: result.StatusCode
        }
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create face collection'
      };
    }
  }

  /**
   * Index a face to a collection
   */
  async indexFace(imageBuffer, collectionId, externalImageId) {
    try {
      const params = {
        CollectionId: collectionId,
        Image: {
          Bytes: imageBuffer
        },
        ExternalImageId: externalImageId,
        MaxFaces: 1,
        QualityFilter: 'AUTO',
        DetectionAttributes: ['ALL']
      };

      const result = await this.rekognition.indexFaces(params).promise();
      
      return {
        success: true,
        data: {
          faceRecords: result.FaceRecords.map(record => ({
            face: record.Face,
            faceDetail: record.FaceDetail
          })),
          orientationCorrection: result.OrientationCorrection,
          faceModelVersion: result.FaceModelVersion,
          unindexedFaces: result.UnindexedFaces
        }
      };
    } catch (error) {
      console.error('Error indexing face:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to index face to collection'
      };
    }
  }

  /**
   * Convert base64 image to buffer
   */
  base64ToBuffer(base64String) {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  /**
   * Validate image quality for face recognition
   */
  async validateImageQuality(imageBuffer) {
    try {
      const faceDetection = await this.detectFaces(imageBuffer);
      
      if (!faceDetection.success || faceDetection.data.faceCount === 0) {
        return {
          valid: false,
          message: 'No faces detected in the image'
        };
      }

      if (faceDetection.data.faceCount > 1) {
        return {
          valid: false,
          message: 'Multiple faces detected. Please ensure only one face is visible.'
        };
      }

      const face = faceDetection.data.faces[0];
      
      // Check image quality thresholds
      if (face.quality.Brightness < 50 || face.quality.Brightness > 90) {
        return {
          valid: false,
          message: 'Image brightness is not optimal. Please ensure good lighting.'
        };
      }

      if (face.quality.Sharpness < 70) {
        return {
          valid: false,
          message: 'Image is not sharp enough. Please ensure the camera is in focus.'
        };
      }

      // Check if eyes are open
      if (!face.eyesOpen.Value) {
        return {
          valid: false,
          message: 'Please keep your eyes open during capture.'
        };
      }

      return {
        valid: true,
        message: 'Image quality is acceptable',
        faceDetails: face
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Error validating image quality: ' + error.message
      };
    }
  }
}

module.exports = RekognitionService;
