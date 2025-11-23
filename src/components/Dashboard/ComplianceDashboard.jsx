import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  BarChart3,
  Download,
  Filter,
  Search,
  Calendar,
  Globe,
  Eye,
  Brain,
  Target,
  Activity,
  Zap
} from 'lucide-react';

const ComplianceDashboard = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('today');
  const [stats, setStats] = useState({
    totalVerifications: 1247,
    completionRate: 94.2,
    averageTime: 4.3,
    riskScore: 96.8,
    activeUsers: 142
  });

  const mockData = {
    recentVerifications: [
      {
        id: 'VER-001',
        user: 'John Doe',
        type: 'Driver License',
        status: 'Completed',
        trustScore: 94,
        timestamp: '2 minutes ago',
        country: 'US'
      },
      {
        id: 'VER-002',
        user: 'Sarah Wilson',
        type: 'Passport',
        status: 'In Progress',
        trustScore: 87,
        timestamp: '5 minutes ago',
        country: 'CA'
      },
      {
        id: 'VER-003',
        user: 'Mike Chen',
        type: 'National ID',
        status: 'Review Required',
        trustScore: 67,
        timestamp: '12 minutes ago',
        country: 'SG'
      },
      {
        id: 'VER-004',
        user: 'Emma Garcia',
        type: 'Driver License',
        status: 'Completed',
        trustScore: 96,
        timestamp: '18 minutes ago',
        country: 'ES'
      },
      {
        id: 'VER-005',
        user: 'David Kim',
        type: 'Passport',
        status: 'Completed',
        trustScore: 92,
        timestamp: '25 minutes ago',
        country: 'KR'
      }
    ],
    aiModuleStats: [
      {
        name: 'SmartVision+',
        icon: Eye,
        accuracy: 98.7,
        processed: 1156,
        avgTime: 2.1,
        color: 'nova-blue'
      },
      {
        name: 'Conversational AI',
        icon: Brain,
        satisfaction: 94.3,
        interactions: 2847,
        resolution: 89.2,
        color: 'nova-purple'
      },
      {
        name: 'TrustGraph',
        icon: Shield,
        accuracy: 96.1,
        flagged: 23,
        falsePositives: 1.2,
        color: 'nova-green'
      }
    ],
    complianceMetrics: [
      { metric: 'AML Compliance', score: 99.2, status: 'Excellent' },
      { metric: 'KYC Standards', score: 97.8, status: 'High' },
      { metric: 'Data Privacy', score: 100, status: 'Perfect' },
      { metric: 'Audit Readiness', score: 95.4, status: 'High' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-nova-green bg-nova-green-light';
      case 'In Progress': return 'text-nova-blue bg-nova-blue-light';
      case 'Review Required': return 'text-nova-orange bg-nova-orange-light';
      default: return 'text-nova-gray-600 bg-nova-gray-100';
    }
  };

  const getTrustScoreColor = (score) => {
    if (score >= 90) return 'text-nova-green';
    if (score >= 80) return 'text-nova-blue';
    if (score >= 70) return 'text-nova-orange';
    return 'text-red-500';
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'nova-blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-nova-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-nova-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-nova-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color} bg-opacity-10 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-nova-green mr-1" />
          <span className="text-nova-green font-medium">+{trend}%</span>
          <span className="text-nova-gray-500 ml-1">vs last week</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-nova-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-nova-gray-900">
              Compliance Dashboard
            </h1>
            <p className="text-nova-gray-600 mt-2">
              Real-time KYC operations monitoring and compliance reporting
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeFrame}
              onChange={(e) => setSelectedTimeFrame(e.target.value)}
              className="input-field"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="btn-primary inline-flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Verifications"
            value={stats.totalVerifications.toLocaleString()}
            subtitle="Today"
            icon={Users}
            trend="12.5"
            color="nova-blue"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            subtitle="Success rate"
            icon={CheckCircle}
            trend="2.1"
            color="nova-green"
          />
          <StatCard
            title="Average Time"
            value={`${stats.averageTime}m`}
            subtitle="Per verification"
            icon={Clock}
            trend="15.3"
            color="nova-purple"
          />
          <StatCard
            title="Risk Score"
            value={`${stats.riskScore}%`}
            subtitle="System health"
            icon={Shield}
            color="nova-green"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            subtitle="Right now"
            icon={Activity}
            color="nova-orange"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* AI Module Performance */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-nova-gray-900">AI Module Performance</h2>
              <div className="flex items-center space-x-2 text-sm text-nova-gray-500">
                <Activity className="w-4 h-4" />
                <span>Real-time</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {mockData.aiModuleStats.map((module, index) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-nova-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-${module.color} bg-opacity-10 flex items-center justify-center`}>
                        <module.icon className={`w-5 h-5 text-${module.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-nova-gray-900">{module.name}</h3>
                        <p className="text-sm text-nova-gray-600">
                          {module.name === 'SmartVision+' && `${module.processed} documents processed`}
                          {module.name === 'Conversational AI' && `${module.interactions} interactions`}
                          {module.name === 'TrustGraph' && `${module.flagged} cases flagged`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold text-${module.color}`}>
                        {module.name === 'SmartVision+' && `${module.accuracy}%`}
                        {module.name === 'Conversational AI' && `${module.satisfaction}%`}
                        {module.name === 'TrustGraph' && `${module.accuracy}%`}
                      </p>
                      <p className="text-sm text-nova-gray-600">
                        {module.name === 'SmartVision+' && 'Accuracy'}
                        {module.name === 'Conversational AI' && 'Satisfaction'}
                        {module.name === 'TrustGraph' && 'Accuracy'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {module.name === 'SmartVision+' && (
                      <>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-gray-900">{module.processed}</p>
                          <p className="text-xs text-nova-gray-600">Processed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-gray-900">{module.avgTime}s</p>
                          <p className="text-xs text-nova-gray-600">Avg Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-green">98.7%</p>
                          <p className="text-xs text-nova-gray-600">Success Rate</p>
                        </div>
                      </>
                    )}
                    {module.name === 'Conversational AI' && (
                      <>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-gray-900">{module.interactions}</p>
                          <p className="text-xs text-nova-gray-600">Interactions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-gray-900">{module.resolution}%</p>
                          <p className="text-xs text-nova-gray-600">Resolution</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-green">2.1s</p>
                          <p className="text-xs text-nova-gray-600">Response Time</p>
                        </div>
                      </>
                    )}
                    {module.name === 'TrustGraph' && (
                      <>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-gray-900">{module.flagged}</p>
                          <p className="text-xs text-nova-gray-600">Cases Flagged</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-gray-900">{module.falsePositives}%</p>
                          <p className="text-xs text-nova-gray-600">False Positive</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-nova-green">99.1%</p>
                          <p className="text-xs text-nova-gray-600">Precision</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Compliance Metrics */}
          <div className="card">
            <h2 className="text-xl font-bold text-nova-gray-900 mb-6">Compliance Score</h2>
            <div className="space-y-4">
              {mockData.complianceMetrics.map((metric, index) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-nova-gray-900">{metric.metric}</p>
                    <p className="text-sm text-nova-gray-600">{metric.status}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getTrustScoreColor(metric.score)}`}>
                      {metric.score}%
                    </p>
                    <div className="w-16 bg-nova-gray-200 rounded-full h-2 mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`${metric.score >= 95 ? 'bg-nova-green' : metric.score >= 90 ? 'bg-nova-blue' : 'bg-nova-orange'} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-nova-green-light rounded-lg border border-nova-green">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-nova-green" />
                <div>
                  <p className="font-semibold text-nova-green">Fully Compliant</p>
                  <p className="text-sm text-nova-gray-700">All regulatory requirements met</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Verifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-nova-gray-900">Recent Verifications</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-nova-gray-400" />
                <input
                  type="text"
                  placeholder="Search verifications..."
                  className="input-field pl-10 w-64"
                />
              </div>
              <button className="btn-secondary inline-flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nova-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">Document Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">Trust Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-nova-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentVerifications.map((verification, index) => (
                  <motion.tr
                    key={verification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-nova-gray-100 hover:bg-nova-gray-50"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-nova-gray-600">{verification.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-nova-blue bg-opacity-10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-nova-blue" />
                        </div>
                        <span className="font-medium text-nova-gray-900">{verification.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-nova-gray-400" />
                        <span className="text-nova-gray-700">{verification.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-nova-gray-400" />
                        <span className="text-nova-gray-700">{verification.country}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(verification.status)}`}>
                        {verification.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${getTrustScoreColor(verification.trustScore)}`}>
                        {verification.trustScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-nova-gray-500">{verification.timestamp}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplianceDashboard;
