import React from 'react';
import { Leaf, Shield, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 relative overflow-hidden">
      {/* Glass morphism background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HerbionYX</h1>
                <p className="text-green-200 text-sm">Ayurvedic Traceability</p>
              </div>
            </div>
            <div className="text-white/80 text-sm">
              Powered by <span className="font-semibold text-white">SENTINELS</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Section */}
            <div className="mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 mb-8">
                <Shield className="h-5 w-5 text-green-300" />
                <span className="text-white font-medium">Blockchain-Powered Authenticity</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                HERBION<span className="text-green-300">YX</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Revolutionary blockchain-based traceability system for Ayurvedic herbs. 
                From farm to pharmacy, ensure authenticity and quality at every step.
              </p>

              <button
                onClick={onEnter}
                className="group bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 border border-white/30 hover:border-white/50 flex items-center space-x-3 mx-auto"
              >
                <span>Enter Platform</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="bg-green-500/20 rounded-xl p-4 w-fit mx-auto mb-6">
                  <Leaf className="h-8 w-8 text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Complete Traceability</h3>
                <p className="text-green-100">Track herbs from collection to final product with immutable blockchain records</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="bg-blue-500/20 rounded-xl p-4 w-fit mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Quality Assurance</h3>
                <p className="text-green-100">Comprehensive quality testing and certification at every supply chain stage</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="bg-purple-500/20 rounded-xl p-4 w-fit mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Multi-Stakeholder</h3>
                <p className="text-green-100">Seamless collaboration between collectors, testers, processors, and manufacturers</p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-16">
              <h3 className="text-2xl font-bold text-white mb-8">Why Choose HerbionYX?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Zero Gas Fees</h4>
                    <p className="text-green-100 text-sm">Free blockchain transactions for all users</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Real-time QR Tracking</h4>
                    <p className="text-green-100 text-sm">Instant verification and tracking capabilities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">140+ Herb Species</h4>
                    <p className="text-green-100 text-sm">Comprehensive database of Ayurvedic herbs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">IPFS Storage</h4>
                    <p className="text-green-100 text-sm">Decentralized and secure data storage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <p className="text-green-100 mb-2">
                Built with ❤️ by <span className="font-bold text-white">SENTINELS</span>
              </p>
              <p className="text-green-200 text-sm">
                Revolutionizing Ayurvedic supply chain transparency through blockchain technology
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;