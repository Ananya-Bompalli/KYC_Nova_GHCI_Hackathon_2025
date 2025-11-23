import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  MapPin, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const PersonalDetailsForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for quick testing - matches Aadhaar extraction
  const mockData = {
    name: 'Neha',
    dateOfBirth: '2000-01-26',
    address: 'Plot 123, Banjara Hills, Hyderabad, Telangana 500034, India'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18 || age > 120) {
        newErrors.dateOfBirth = 'You must be between 18 and 120 years old';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Pass data to next step
    onComplete({
      personalDetails: formData,
      timestamp: Date.now()
    });
    
    setIsSubmitting(false);
  };

  const fillMockData = () => {
    setFormData(mockData);
    setErrors({});
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-nova-gray-900">
            Personal Information
          </h2>
          <p className="text-nova-gray-600 mt-1">
            Please provide your personal details to begin KYC verification
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-nova-purple" />
          <span className="text-sm font-medium text-nova-purple">Step 1 of 4</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-nova-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name as per ID document"
              className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
              maxLength={100}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-nova-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`input-field ${errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
            {formData.dateOfBirth && !errors.dateOfBirth && (
              <p className="mt-1 text-sm text-nova-gray-600">
                Age: {calculateAge(formData.dateOfBirth)} years
              </p>
            )}
            {errors.dateOfBirth && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.dateOfBirth}
              </motion.p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-nova-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Complete Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your complete address including city, state, and postal code"
              rows={3}
              className={`input-field resize-none ${errors.address ? 'border-red-300 focus:border-red-500' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {errors.address && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600 flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.address}
                  </motion.p>
                )}
              </div>
              <span className="text-xs text-nova-gray-500">
                {formData.address.length}/500
              </span>
            </div>
          </div>

          {/* Form Summary */}
          {formData.name && formData.dateOfBirth && formData.address && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 rounded-lg p-4 border border-green-200"
            >
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">Information Summary</h4>
                  <div className="mt-2 space-y-1 text-sm text-green-700">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Age:</strong> {calculateAge(formData.dateOfBirth)} years old</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between pt-6">
            <div className="text-sm text-nova-gray-500">
              All fields marked with * are required
            </div>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`btn-primary inline-flex items-center ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Continue to Document Scan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Next Steps Preview */}
        <div className="bg-nova-gray-50 rounded-lg p-4 border">
          <h4 className="font-medium text-nova-gray-900 mb-2">What's Next?</h4>
          <div className="space-y-2 text-sm text-nova-gray-600">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-nova-purple" />
              <span>Scan your Aadhaar card for document verification</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-nova-purple" />
              <span>Complete liveness detection with facial verification</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-nova-purple" />
              <span>Receive verification results and trust score</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalDetailsForm;
