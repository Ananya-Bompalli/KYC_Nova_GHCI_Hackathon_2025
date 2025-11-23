import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, Eye, Users } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'KYC Demo', href: '/kyc', current: location.pathname === '/kyc' },
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b border-nova-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-nova-green rounded-full flex items-center justify-center">
                <Brain className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-nova-gray-900">
                KYC <span className="text-nova-blue">Nova</span>
              </h1>
              <p className="text-sm text-nova-gray-500">AI-Powered Onboarding</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'text-nova-blue bg-nova-blue-light'
                    : 'text-nova-gray-700 hover:text-nova-blue hover:bg-nova-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Feature Icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-3 text-nova-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs">Vision AI</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span className="text-xs">Smart AI</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs">TrustGraph</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-nova-green rounded-full animate-pulse"></div>
              <span className="text-sm text-nova-gray-600 font-medium">Live Demo</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
