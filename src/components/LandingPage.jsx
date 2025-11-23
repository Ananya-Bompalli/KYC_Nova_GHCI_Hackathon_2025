import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  Eye, 
  Zap, 
  Users, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Target,
  Globe,
  X
} from 'lucide-react';
import CompleteKYCFlow from './SmartVision/CompleteKYCFlow';

const LandingPage = () => {
  const [showKYCDemo, setShowKYCDemo] = useState(false);

  const handleStartDemo = () => {
    setShowKYCDemo(true);
  };

  const handleCloseDemo = () => {
    setShowKYCDemo(false);
  };

  // If KYC demo is active, show the complete flow
  if (showKYCDemo) {
    return (
      <div className="min-h-screen bg-nova-gray-50">
        {/* Demo Header */}
        <div className="bg-white border-b border-nova-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-nova-gray-900">
                  KYC Nova - Live Demo
                </h1>
                <p className="text-sm text-nova-gray-600">
                  Complete end-to-end KYC verification experience
                </p>
              </div>
              <button
                onClick={handleCloseDemo}
                className="btn-secondary px-4 py-2 text-sm inline-flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Exit Demo
              </button>
            </div>
          </div>
        </div>

        {/* KYC Flow Component */}
        <CompleteKYCFlow />
      </div>
    );
  }

  const features = [
    {
      icon: Eye,
      title: 'SmartVision+',
      description: 'Advanced document verification with micro-pattern recognition, hologram analysis, and real-time forgery detection.',
      color: 'nova-blue'
    },
    {
      icon: Brain,
      title: 'Conversational AI',
      description: 'Friendly AI companion that guides users step-by-step with contextual, empathetic guidance.',
      color: 'nova-purple'
    },
    {
      icon: Shield,
      title: 'TrustGraph AI',
      description: 'Dynamic trust scoring with explainable AI decisions and regulator-ready audit summaries.',
      color: 'nova-green'
    }
  ];

  const benefits = [
    { icon: Zap, text: '95% reduction in manual verification effort' },
    { icon: Clock, text: 'Under 10-minute onboarding for verified users' },
    { icon: Target, text: 'Explainable, regulator-trusted AI decisions' },
    { icon: Globe, text: 'Scalable across banks, fintechs, and geographies' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nova-blue via-nova-purple to-nova-blue-dark">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              KYC <span className="text-yellow-300">Nova</span>
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-balance"
            >
              The AI Copilot for Effortless, Explainable Onboarding
            </motion.p>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-white/80 mb-12 max-w-2xl mx-auto"
            >
              Transform compliance from a checkpoint into a transparent, intelligent, and human-centered experience
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={handleStartDemo}
                className="btn-primary bg-white text-nova-blue hover:bg-nova-gray-50 inline-flex items-center justify-center"
              >
                Try
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <Link
                to="/dashboard"
                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 inline-flex items-center justify-center"
              >
                View Dashboard
                <Shield className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
          >
            <Eye className="w-10 h-10 text-nova-blue" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
          >
            <Brain className="w-8 h-8 text-nova-purple" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-nova-gray-900 mb-4">
              Powered by Multimodal Intelligence
            </h2>
            <p className="text-xl text-nova-gray-600 max-w-3xl mx-auto">
              Three AI modules working together to transform KYC from a manual task into an effortless, auditable conversation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card text-center group hover:scale-105"
              >
                <div className={`w-16 h-16 bg-${feature.color} bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-nova-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-nova-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-nova-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-nova-gray-900 mb-4">
              Transformative Impact
            </h2>
            <p className="text-xl text-nova-gray-600">
              Not just faster KYC — onboarding powered by intelligence and integrity
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-nova-blue bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-nova-blue" />
                </div>
                <p className="text-nova-gray-700 font-medium">
                  {benefit.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-nova-gray-900 mb-6">
                Security, Compliance & Fairness
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-nova-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-nova-gray-900">Edge AI & Federated Learning</h3>
                    <p className="text-nova-gray-600">Personal data never leaves the device, ensuring maximum privacy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-nova-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-nova-gray-900">Zero-Trust Architecture</h3>
                    <p className="text-nova-gray-600">End-to-end encryption and comprehensive security protocols</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-nova-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-nova-gray-900">Global Compliance</h3>
                    <p className="text-nova-gray-600">GDPR, ISO 27001, and global KYC/AML standards compliant</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-nova-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-nova-gray-900">Bias-Free Intelligence</h3>
                    <p className="text-nova-gray-600">Continuous monitoring ensures equitable outcomes across demographics</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-nova-gray-900">Security Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-nova-green rounded-full animate-pulse"></div>
                    <span className="text-nova-green font-medium">Secure</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-nova-gray-600">Encryption Level</span>
                    <span className="font-semibold text-nova-green">AES-256</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-nova-gray-600">Compliance Score</span>
                    <span className="font-semibold text-nova-green">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-nova-gray-600">Privacy Rating</span>
                    <span className="font-semibold text-nova-green">A+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-nova-gray-600">Bias Monitoring</span>
                    <span className="font-semibold text-nova-green">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-nova-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the Future of KYC?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            See how KYC Nova transforms compliance into an intelligent, transparent conversation
          </p>
          <Link
            to="/kyc"
            className="btn-primary bg-nova-blue hover:bg-nova-blue-dark inline-flex items-center justify-center text-lg px-8 py-4"
          >
            Start Demo Experience
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
