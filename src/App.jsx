import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Common/Header';
import LandingPage from './components/LandingPage';
import KYCFlow from './components/Dashboard/KYCFlow';
import ComplianceDashboard from './components/Dashboard/ComplianceDashboard';
import CompleteKYCFlow from './components/SmartVision/CompleteKYCFlow';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-nova-gray-50">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/kyc" element={<KYCFlow />} />
            <Route path="/complete-kyc" element={<CompleteKYCFlow />} />
            <Route path="/dashboard" element={<ComplianceDashboard />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
