
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ARSceneProps {
  currentStep: string;
  onStepComplete: () => void;
}

// Enhanced Anime Avatar with detailed features and proper error handling
const AnimeAvatar = ({ position, currentStep }: { position: [number, number, number], currentStep: string }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    try {
      // Continuous floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      
      // Step-specific animations with error protection
      switch (currentStep) {
        case 'face':
          meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.3;
          // Face scanning effect
          meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.05);
          break;
        case 'voice':
          meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
          // Voice wave effect
          meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.1;
          break;
        case 'gesture':
          meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.2;
          meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
          break;
        case 'body':
          meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
          // Walking animation
          meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
          break;
      }
    } catch (error) {
      console.warn('Animation error caught:', error);
    }
  });

  // Create detailed anime-style character with error handling
  const createCharacterParts = () => {
    try {
      return (
        <group ref={meshRef} position={position}>
          {/* Head with anime features */}
          <Sphere args={[0.6, 32, 32]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#ffdbac" />
          </Sphere>
          
          {/* Large anime eyes */}
          <Sphere args={[0.15, 16, 16]} position={[-0.2, 1.6, 0.5]}>
            <meshStandardMaterial color="#4a90e2" />
          </Sphere>
          <Sphere args={[0.15, 16, 16]} position={[0.2, 1.6, 0.5]}>
            <meshStandardMaterial color="#4a90e2" />
          </Sphere>
          
          {/* Eye pupils */}
          <Sphere args={[0.08, 16, 16]} position={[-0.2, 1.6, 0.52]}>
            <meshStandardMaterial color="#000" />
          </Sphere>
          <Sphere args={[0.08, 16, 16]} position={[0.2, 1.6, 0.52]}>
            <meshStandardMaterial color="#000" />
          </Sphere>
          
          {/* Anime hair */}
          <Sphere args={[0.65, 16, 16]} position={[0, 1.8, -0.1]}>
            <meshStandardMaterial color="#8b4513" />
          </Sphere>
          
          {/* Body */}
          <Box args={[0.8, 1.2, 0.4]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ff6b9d" />
          </Box>
          
          {/* Arms */}
          <Box args={[0.2, 0.8, 0.2]} position={[-0.6, 0.2, 0]}>
            <meshStandardMaterial color="#ffdbac" />
          </Box>
          <Box args={[0.2, 0.8, 0.2]} position={[0.6, 0.2, 0]}>
            <meshStandardMaterial color="#ffdbac" />
          </Box>
          
          {/* Legs */}
          <Box args={[0.25, 1, 0.25]} position={[-0.2, -1.2, 0]}>
            <meshStandardMaterial color="#4a90e2" />
          </Box>
          <Box args={[0.25, 1, 0.25]} position={[0.2, -1.2, 0]}>
            <meshStandardMaterial color="#4a90e2" />
          </Box>
          
          {/* Accessories based on current step */}
          {currentStep === 'face' && (
            <Box args={[0.1, 0.1, 0.1]} position={[0, 1.3, 0.6]}>
              <meshStandardMaterial color="#00ffff" />
            </Box>
          )}
          {currentStep === 'voice' && (
            <Sphere args={[0.15, 8, 8]} position={[0, 1.2, 0.6]}>
              <meshStandardMaterial color="#00ff00" />
            </Sphere>
          )}
          {currentStep === 'gesture' && (
            <Box args={[0.3, 0.1, 0.1]} position={[0.8, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color="#ff00ff" />
            </Box>
          )}
          {currentStep === 'body' && (
            <Box args={[0.1, 0.5, 0.1]} position={[0, -1.7, 0]}>
              <meshStandardMaterial color="#ffaa00" />
            </Box>
          )}
        </group>
      );
    } catch (error) {
      console.warn('Character creation error:', error);
      return (
        <group ref={meshRef} position={position}>
          <Box args={[1, 2, 1]}>
            <meshStandardMaterial color="#ff6b9d" />
          </Box>
        </group>
      );
    }
  };

  return createCharacterParts();
};

// Enhanced biometric demo with visual effects
const BiometricDemo = ({ type }: { type: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    try {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
        meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
      }
      
      // Add particle effects
      if (particlesRef.current) {
        particlesRef.current.children.forEach((particle, index) => {
          if (particle.position) {
            particle.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
            particle.rotation.y = state.clock.elapsedTime * (index + 1);
          }
        });
      }
    } catch (error) {
      console.warn('BiometricDemo animation error:', error);
    }
  });

  const getColor = () => {
    switch (type) {
      case 'face': return '#00ffff';
      case 'voice': return '#00ff00';
      case 'gesture': return '#ff00ff';
      case 'body': return '#ffaa00';
      default: return '#ffffff';
    }
  };

  return (
    <group position={[3, 0, 0]}>
      <Box ref={meshRef} args={[1, 1, 1]}>
        <meshStandardMaterial color={getColor()} />
      </Box>
      
      {/* Particle effects */}
      <group ref={particlesRef}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Sphere key={i} args={[0.1, 8, 8]} position={[Math.sin(i) * 2, i * 0.5, Math.cos(i) * 2]}>
            <meshStandardMaterial color={getColor()} transparent opacity={0.6} />
          </Sphere>
        ))}
      </group>
    </group>
  );
};

// Enhanced UI elements with animations
const AnimatedUI = ({ currentStep }: { currentStep: string }) => {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    try {
      if (textRef.current && textRef.current.position) {
        textRef.current.position.y = 4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    } catch (error) {
      console.warn('UI animation error:', error);
    }
  });

  return (
    <>
      <Text
        ref={textRef}
        position={[0, 4, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
      >
        🤖 AI Guide Demonstration
      </Text>
      
      <Text
        position={[0, -3, 0]}
        fontSize={0.3}
        color="#cyan"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
      >
        {getStepMessage(currentStep)}
      </Text>
    </>
  );
};

const getStepMessage = (step: string): string => {
  switch (step) {
    case 'face':
      return '👤 Watch how I scan facial features with precision!';
    case 'voice':
      return '🎤 Listen to advanced voice pattern analysis!';
    case 'gesture':
      return '✋ See intelligent gesture recognition in action!';
    case 'body':
      return '🚶 Observe sophisticated body pattern detection!';
    default:
      return '🚀 Welcome to BioQuantum Learning! Let\'s explore biometric authentication!';
  }
};

const ARScene: React.FC<ARSceneProps> = ({ currentStep, onStepComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('ARScene mounted with step:', currentStep);
    setIsActive(true);
    setError(null);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            console.log('ARScene step completed:', currentStep);
            onStepComplete();
          }, 1000);
          return 100;
        }
        return prev + 12.5; // 8 steps to complete
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    };
  }, [currentStep, onStepComplete]);

  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error);
    setError('Failed to load 3D scene. Please refresh the page.');
  };

  if (error) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl mb-2">AR Scene Loading...</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-500 rounded text-white hover:bg-purple-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg overflow-hidden relative"
    >
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 75 }}
        onCreated={(state) => {
          console.log('Canvas created successfully');
          setError(null);
        }}
        onError={handleCanvasError}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true 
        }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[0, 5, 5]} intensity={0.8} color="#00ffff" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#ffaa00" />
        
        {/* Main components with error boundaries */}
        <AnimeAvatar position={[0, 0, 0]} currentStep={currentStep} />
        <BiometricDemo type={currentStep} />
        <AnimatedUI currentStep={currentStep} />
        
        {/* Interactive controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
      
      {/* Enhanced UI overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI Avatar demonstrating {currentStep} authentication
            </p>
            <span className="text-cyan-400 font-bold">{progress.toFixed(0)}%</span>
          </div>
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-300 mt-2">
            🔹 3D Animation Active 🔹 AR Processing 🔹 Biometric Analysis
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ARScene;
