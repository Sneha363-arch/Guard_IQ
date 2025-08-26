
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import AuthSimulator from '@/components/AuthSimulator';
import ErrorBoundary from '@/components/ErrorBoundary';

const LearningLab = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center text-white">
          <Shield className="w-8 h-8 text-cyan-500 mr-2" />
          <span className="text-xl font-bold">BioQuantumGate</span>
        </div>
      </div>

      {/* Main Content with Error Boundary */}
      <ErrorBoundary>
        <AuthSimulator />
      </ErrorBoundary>
    </div>
  );
};

export default LearningLab;
