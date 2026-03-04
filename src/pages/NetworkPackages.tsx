import React, { useState } from 'react';
import { 
  Package, Box, CheckCircle2, AlertTriangle, Clock, 
  ChevronRight, Search, Filter, Download, Upload, 
  Globe, Shield, Activity, FileText, Zap, Server,
  Layout, GitBranch, ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface DomainPackage {
  id: string;
  name: string;
  version: string;
  status: 'Published' | 'Draft' | 'Archived';
  health: number;
  coverage: number;
  updatedAt: string;
  author: string;
  description: string;
  services: { type: 'Intent' | 'API' | 'Dataset'; name: string; status: 'Active' | 'Inactive' }[];
  constraints: { type: 'Auth' | 'Masking' | 'Limit'; desc: string }[];
  validation: { schema: boolean; consistency: boolean; risk: 'Low' | 'Medium' | 'High' };
}

export default function NetworkPackages() {
  const [selectedPkgId, setSelectedPkgId] = useState<string>('p1');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock Data
  const packages: DomainPackage[] = [
    {
      id: 'p1',
      name: 'Customer_360_Core',
      version: 'v2.4.0',
      status: 'Published',
      health: 98,
      coverage: 85,
      updatedAt: '2 hours ago',
      author: 'Data Team',
      description: 'Core customer domain package including profile, identity resolution, and basic segmentation.',
      services: [
        { type: 'Intent', name: 'GetCustomerProfile', status: 'Active' },
        { type: 'Intent', name: 'FindHighValueCustomers', status: 'Active' },
        { type: 'API', name: 'customer-service-v2', status: 'Active' }
      ],
      constraints: [
        { type: 'Auth', desc: 'Requires scope: customer.read' },
        { type: 'Masking', desc: 'PII (email, phone) masked for non-admin' }
      ],
      validation: { schema: true, consistency: true, risk: 'Low' }
    },
    {
      id: 'p2',
      name: 'Sales_Order_Analytics',
      version: 'v1.1.0',
      status: 'Draft',
      health: 82,
      coverage: 60,
      updatedAt: '1 day ago',
      author: 'Sales Ops',
      description: 'Order processing and revenue analytics domain model.',
      services: [
        { type: 'Dataset', name: 'daily_sales_mart', status: 'Inactive' },
        { type: 'Intent', name: 'AnalyzeRevenueTrend', status: 'Inactive' }
      ],
      constraints: [
        { type: 'Limit', desc: 'Max query window: 30 days' }
      ],
      validation: { schema: true, consistency: false, risk: 'Medium' }
    },
    {
      id: 'p3',
      name: 'Logistics_Tracking',
      version: 'v1.0.5',
      status: 'Published',
      health: 95,
      coverage: 90,
      updatedAt: '3 days ago',
      author: 'Supply Chain',
      description: 'Real-time shipment tracking and inventory management.',
      services: [
        { type: 'API', name: 'shipment-tracking-api', status: 'Active' }
      ],
      constraints: [],
      validation: { schema: true, consistency: true, risk: 'Low' }
    }
  ];

  const selectedPkg = packages.find(p => p.id === selectedPkgId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Draft': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Archived': return 'bg-slate-700/50 text-slate-400 border-slate-600';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white">
            <Package size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Domain Packages</h1>
            <p className="text-xs text-slate-400">Manage and deploy domain knowledge networks</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Upload size={14} />
            <span>Import Package</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Package List (Left) */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/30 flex flex-col">
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search packages..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Packages ({packages.length})</span>
              <Filter size={12} className="text-slate-500 cursor-pointer hover:text-slate-300" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {packages.map(pkg => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`p-4 border-b border-slate-800 cursor-pointer transition-colors hover:bg-slate-800/50 ${
                  selectedPkgId === pkg.id ? 'bg-indigo-900/10 border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                  <span className="text-xs text-slate-500">{pkg.updatedAt}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">{pkg.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
                  <span className="font-mono text-indigo-300">{pkg.version}</span>
                  <span>•</span>
                  <span>{pkg.author}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Activity size={12} className={getHealthColor(pkg.health)} />
                    <span className={getHealthColor(pkg.health)}>{pkg.health}% Health</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500">
                    <Box size={12} />
                    <span>{pkg.coverage}% Cov</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Detail (Right) */}
        <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
          {selectedPkg ? (
            <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
              {/* Detail Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{selectedPkg.name}</h2>
                    <span className="px-2 py-1 rounded-md bg-slate-800 text-indigo-300 font-mono text-sm border border-slate-700">
                      {selectedPkg.version}
                    </span>
                  </div>
                  <p className="text-slate-400 max-w-2xl">{selectedPkg.description}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 transition-colors">
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition-colors">
                    <Globe size={16} />
                    <span>Deploy</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Health Score</div>
                  <div className={`text-2xl font-bold ${getHealthColor(selectedPkg.health)}`}>{selectedPkg.health}/100</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Domain Coverage</div>
                  <div className="text-2xl font-bold text-indigo-400">{selectedPkg.coverage}%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Services</div>
                  <div className="text-2xl font-bold text-blue-400">{selectedPkg.services.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Risk Level</div>
                  <div className={`text-2xl font-bold ${
                    selectedPkg.validation.risk === 'High' ? 'text-red-400' : 
                    selectedPkg.validation.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{selectedPkg.validation.risk}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Subgraph & Validation */}
                <div className="col-span-2 space-y-8">
                  {/* Included Subgraph */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                      <Layout size={16} className="mr-2" />
                      Included Subgraph (Snapshot)
                    </h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 h-64 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                      {/* Mock Graph Visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-indigo-500/30 rounded-full animate-pulse"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-500/20 rounded-full backdrop-blur-sm border border-indigo-500/50 flex items-center justify-center">
                            <Box size={24} className="text-indigo-400" />
                          </div>
                          {/* Orbiting Nodes */}
                          <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Database size={16} className="text-slate-400" />
                          </div>
                          <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Activity size={16} className="text-emerald-400" />
                          </div>
                          <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Shield size={16} className="text-amber-400" />
                          </div>
                          {/* Connecting Lines */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#475569" strokeWidth="1" strokeDasharray="4" />
                            <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#475569" strokeWidth="1" strokeDasharray="4" />
                            <line x1="50%" y1="50%" x2="66%" y2="33%" stroke="#475569" strokeWidth="1" strokeDasharray="4" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <button className="px-3 py-1.5 bg-slate-800/80 backdrop-blur text-xs text-slate-300 rounded border border-slate-700 hover:text-white transition-colors">
                          View Full Graph
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Validation Report */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                      <CheckCircle2 size={16} className="mr-2" />
                      Validation Report
                    </h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${selectedPkg.validation.risk === 'High' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                          <span className="text-sm font-medium text-slate-200">Overall Status</span>
                        </div>
                        <span className="text-xs text-slate-500">Last run: {selectedPkg.updatedAt}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Schema Integrity</span>
                          {selectedPkg.validation.schema ? (
                            <span className="flex items-center text-xs text-emerald-400"><CheckCircle2 size={14} className="mr-1" /> Passed</span>
                          ) : (
                            <span className="flex items-center text-xs text-red-400"><AlertTriangle size={14} className="mr-1" /> Failed</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Semantic Consistency</span>
                          {selectedPkg.validation.consistency ? (
                            <span className="flex items-center text-xs text-emerald-400"><CheckCircle2 size={14} className="mr-1" /> Passed</span>
                          ) : (
                            <span className="flex items-center text-xs text-amber-400"><AlertTriangle size={14} className="mr-1" /> Warning</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Risk Assessment</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            selectedPkg.validation.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                            selectedPkg.validation.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>{selectedPkg.validation.risk} Risk</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Services & Constraints */}
                <div className="space-y-8">
                  {/* Exposed Services */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                      <Zap size={16} className="mr-2" />
                      Exposed Services
                    </h3>
                    <div className="space-y-3">
                      {selectedPkg.services.map((svc, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-indigo-500/50 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              svc.type === 'Intent' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                              svc.type === 'API' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-slate-700/50 text-slate-400 border-slate-600'
                            }`}>{svc.type}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${svc.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                          </div>
                          <div className="text-sm font-medium text-slate-200 truncate">{svc.name}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Constraints */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                      <Shield size={16} className="mr-2" />
                      Constraints
                    </h3>
                    <div className="space-y-3">
                      {selectedPkg.constraints.length > 0 ? selectedPkg.constraints.map((c, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                          <div className="mt-0.5">
                            {c.type === 'Auth' && <Shield size={14} className="text-amber-400" />}
                            {c.type === 'Masking' && <FileText size={14} className="text-blue-400" />}
                            {c.type === 'Limit' && <Activity size={14} className="text-red-400" />}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-300 mb-0.5">{c.type} Policy</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{c.desc}</div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-xs text-slate-500 italic p-3 text-center bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                          No constraints defined
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Deploy Targets */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                      <Server size={16} className="mr-2" />
                      Deploy Targets
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-indigo-500/20 rounded text-indigo-400 group-hover:text-indigo-300">
                            <Globe size={14} />
                          </div>
                          <span className="text-xs font-medium text-slate-300 group-hover:text-white">Data Portal (Ask Data)</span>
                        </div>
                        <ArrowUpRight size={12} className="text-slate-500 group-hover:text-white" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-emerald-500/20 rounded text-emerald-400 group-hover:text-emerald-300">
                            <GitBranch size={14} />
                          </div>
                          <span className="text-xs font-medium text-slate-300 group-hover:text-white">Agent Orchestrator</span>
                        </div>
                        <ArrowUpRight size={12} className="text-slate-500 group-hover:text-white" />
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Package size={48} className="mb-4 opacity-20" />
              <p>Select a package to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
