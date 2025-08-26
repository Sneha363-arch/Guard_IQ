
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

const HomeChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hi! I\'m your BioQuantum AI Guide! 🤖 Ask me about our app, features, Learning Lab, Quantum AI, or Cybersecurity! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const userMessage = event.results[0][0].transcript;
        handleUserMessage(userMessage);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak("Sorry, I couldn't hear you clearly. Please try again!");
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleUserMessage = (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    // Generate bot response
    const botResponse = generateBotResponse(userMessage);
    
    setTimeout(() => {
      const newBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
      speak(botResponse);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('app') || lowerMessage.includes('about')) {
      return "BioQuantumGate is a cutting-edge biometric authentication platform! 🚀 We use advanced quantum encryption and AI to secure your digital identity through Face, Voice, Gesture, and Body Pattern recognition. It's the future of security! 🔐";
    }
    
    if (lowerMessage.includes('feature')) {
      return "Our amazing features include: 🌟 Multi-modal biometric authentication (Face, Voice, Gesture, Body), 🔐 Quantum-safe encryption, 🤖 AI-powered learning simulations, 🎯 Interactive AR experiences, and 🛡️ Advanced cybersecurity protection!";
    }
    
    if (lowerMessage.includes('learning') || lowerMessage.includes('lab')) {
      return "The Learning Lab is awesome! 🧪 It's an interactive AR simulation where you can learn how each biometric authentication method works. You'll see 3D animations, practice with real simulations, and understand the science behind secure authentication! Try it out! 🎮";
    }
    
    if (lowerMessage.includes('quantum') || lowerMessage.includes('ai')) {
      return "Our Quantum AI combines quantum computing principles with artificial intelligence! 🧠⚡ It provides unbreakable encryption, lightning-fast processing, and adaptive learning capabilities. This ensures your biometric data is protected against even future quantum attacks! 🛡️";
    }
    
    if (lowerMessage.includes('cyber') || lowerMessage.includes('security')) {
      return "Cybersecurity is our top priority! 🛡️ We implement: Zero-trust architecture, End-to-end encryption, Real-time threat detection, Quantum-resistant algorithms, Multi-factor authentication, and Continuous security monitoring. Your data is safer than Fort Knox! 🏰";
    }
    
    if (lowerMessage.includes('how') || lowerMessage.includes('work')) {
      return "Here's how it works: 1️⃣ Register with traditional credentials, 2️⃣ Set up your biometric profiles (Face, Voice, Gesture, Body), 3️⃣ Use any combination for secure login, 4️⃣ Our AI continuously learns and improves your security! Simple yet powerful! ✨";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello there! 👋 Welcome to BioQuantumGate! I'm excited to help you explore our revolutionary biometric authentication platform. What would you like to know first? 🤔";
    }
    
    if (lowerMessage.includes('help')) {
      return "I'm here to help! 💪 You can ask me about: 📱 App features and capabilities, 🔬 Learning Lab simulations, 🔐 Security and encryption, 🤖 AI and quantum technology, 🚀 Getting started guide, or anything else about BioQuantumGate!";
    }
    
    return "That's a great question! 🤔 BioQuantumGate offers revolutionary biometric security with quantum-safe encryption. Try asking me about our features, Learning Lab, security measures, or how to get started! I'm here to help! 😊";
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 2
              }}
            >
              🤖
            </motion.div>
          </Button>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px]"
          >
            <Card className="h-full border-2 border-purple-300 bg-gradient-to-br from-white to-purple-50 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    🤖
                  </motion.div>
                  <div>
                    <h3 className="font-bold">BioQuantum AI Guide</h3>
                    <p className="text-xs opacity-90">Your personal assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="flex flex-col h-full p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Controls */}
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex space-x-2 justify-center">
                    <Button
                      size="sm"
                      variant={isListening ? "destructive" : "default"}
                      onClick={isListening ? stopListening : startListening}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isListening ? "Stop" : "Ask"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={isSpeaking ? "destructive" : "outline"}
                      onClick={isSpeaking ? stopSpeaking : () => speak("Hi! I'm ready to help you learn about BioQuantumGate!")}
                      disabled={!isSpeaking && isListening}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      {isSpeaking ? "Quiet" : "Demo"}
                    </Button>
                  </div>
                  
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-600">
                      {isListening ? "🎤 Listening..." : 
                       isSpeaking ? "🔊 Speaking..." : 
                       "💬 Click Ask to speak!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomeChatbot;
