import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Scan, Mic, HandIcon, Activity, CheckCircle, Play, RotateCcw } from 'lucide-react';
import ARScene from './ARScene';
import VoiceAssistant from './VoiceAssistant';
import ErrorBoundary from './ErrorBoundary';

interface AuthStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
}

const AuthSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>('intro');
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(true);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  
  const [authSteps, setAuthSteps] = useState<AuthStep[]>([
    {
      id: 'face',
      title: 'Face Recognition',
      description: 'Learn how facial features create unique digital signatures',
      icon: <Scan className="w-6 h-6" />,
      color: 'bg-cyan-500',
      completed: false
    },
    {
      id: 'voice',
      title: 'Voice Authentication',
      description: 'Discover how vocal patterns identify individuals',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-green-500',
      completed: false
    },
    {
      id: 'gesture',
      title: 'Gesture Recognition',
      description: 'Explore hand movement and pose authentication',
      icon: <HandIcon className="w-6 h-6" />,
      color: 'bg-purple-500',
      completed: false
    },
    {
      id: 'body',
      title: 'Body Pattern Analysis',
      description: 'Understand gait and posture-based identification',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-orange-500',
      completed: false
    }
  ]);

  useEffect(() => {
    console.log('AuthSimulator mounted');
    const completedSteps = authSteps.filter(step => step.completed).length;
    setProgress((completedSteps / authSteps.length) * 100);
  }, [authSteps]);

  const startSimulation = (stepId: string) => {
    console.log('Starting simulation for step:', stepId);
    setCurrentStep(stepId);
    setIsSimulating(true);
    setSimulationError(null);
    
    // Add timeout to prevent infinite loading
    setTimeout(() => {
      if (isSimulating) {
        console.log('Simulation timeout, auto-completing');
        handleStepComplete();
      }
    }, 10000); // 10 second timeout
  };

  const handleStepComplete = () => {
    console.log('Step completed:', currentStep);
    setAuthSteps(prev => 
      prev.map(step => 
        step.id === currentStep 
          ? { ...step, completed: true }
          : step
      )
    );
    setIsSimulating(false);
    setCurrentStep('intro');
    setSimulationError(null);
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    const step = authSteps.find(s => s.id === command);
    if (step && !step.completed) {
      startSimulation(command);
    }
  };

  const resetProgress = () => {
    console.log('Resetting progress');
    setAuthSteps(prev => 
      prev.map(step => ({ ...step, completed: false }))
    );
    setCurrentStep('intro');
    setIsSimulating(false);
    setSimulationError(null);
  };

  const handleSimulationError = (error: string) => {
    console.error('Simulation error:', error);
    setSimulationError(error);
    setIsSimulating(false);
  };

  const completedCount = authSteps.filter(step => step.completed).length;
  const allCompleted = completedCount === authSteps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 BioQuantum Learning Lab
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Interactive AR simulations for biometric authentication
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Progress: {authSteps.filter(step => step.completed).length}/{authSteps.length}
            </Badge>
            {authSteps.filter(step => step.completed).length === authSteps.length && (
              <Badge className="text-lg px-4 py-2 bg-green-500">
                🎉 All Complete!
              </Badge>
            )}
          </div>
          
          <Progress value={progress} className="w-full max-w-md mx-auto mb-4" />
          
          <Button
            onClick={() => {
              setAuthSteps(prev => prev.map(step => ({ ...step, completed: false })));
              setCurrentStep('intro');
              setIsSimulating(false);
              setSimulationError(null);
            }}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        </motion.div>

        {/* AR Scene with Error Boundary */}
        <AnimatePresence>
          {isSimulating && !simulationError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="border-2 border-purple-400 bg-black/20 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-white flex items-center justify-center">
                    <span className="text-2xl mr-2">🤖</span>
                    AI Guide Demonstration
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Watch and learn how {authSteps.find(s => s.id === currentStep)?.title} works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <ARScene 
                      currentStep={currentStep} 
                      onStepComplete={() => {
                        setAuthSteps(prev => 
                          prev.map(step => 
                            step.id === currentStep 
                              ? { ...step, completed: true }
                              : step
                          )
                        );
                        setIsSimulating(false);
                        setCurrentStep('intro');
                      }}
                    />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {simulationError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-red-400 bg-red-50/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl text-white mb-2">Simulation Error</h3>
                <p className="text-gray-300 mb-4">{simulationError}</p>
                <Button
                  onClick={() => setSimulationError(null)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Learning Modules */}
        {!isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {authSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`border-2 ${step.completed ? 'border-green-400 bg-green-50/10' : 'border-gray-600 bg-black/20'} backdrop-blur-sm hover:scale-105 transition-transform duration-200`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full ${step.color} text-white`}>
                          {step.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white">{step.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                      {step.completed && (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => {
                        setCurrentStep(step.id);
                        setIsSimulating(true);
                        setSimulationError(null);
                      }}
                      disabled={step.completed}
                      className={`w-full ${step.completed ? 'bg-green-500' : step.color} text-white`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {step.completed ? 'Completed' : 'Start Simulation'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Completion Message */}
        {allCompleted && !isSimulating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Congratulations!
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  You've completed all biometric authentication simulations!
                </p>
                <p className="text-gray-400">
                  You're now ready to experience the real BioQuantum authentication system.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant
        onCommand={(command: string) => {
          const step = authSteps.find(s => s.id === command);
          if (step && !step.completed) {
            setCurrentStep(command);
            setIsSimulating(true);
            setSimulationError(null);
          }
        }}
        isActive={voiceAssistantActive}
      />
    </div>
  );
};

export default AuthSimulator;
