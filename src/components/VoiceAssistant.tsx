
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
  isActive: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand, isActive }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    console.log('VoiceAssistant component mounted');
    
    // Check for Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        console.log('Speech recognition result:', event);
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
        
        if (event.results[current].isFinal) {
          console.log('Final transcript:', transcriptResult);
          handleVoiceCommand(transcriptResult);
        }
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak(`Sorry, I couldn't understand. Error: ${event.error}`);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition not supported in this browser');
      setIsSupported(false);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('face') || lowerCommand.includes('facial')) {
      speak("Face authentication uses your unique facial features to verify your identity. It's like a digital fingerprint for your face!");
      onCommand('face');
    } else if (lowerCommand.includes('voice') || lowerCommand.includes('speech')) {
      speak("Voice authentication analyzes your vocal patterns, tone, and speaking style. Everyone has a unique voice signature!");
      onCommand('voice');
    } else if (lowerCommand.includes('gesture') || lowerCommand.includes('hand')) {
      speak("Gesture recognition tracks your hand movements and poses. It's like having a secret handshake with your device!");
      onCommand('gesture');
    } else if (lowerCommand.includes('body') || lowerCommand.includes('pattern')) {
      speak("Body pattern analysis studies your unique walking style and posture. It's biometrics in motion!");
      onCommand('body');
    } else if (lowerCommand.includes('help') || lowerCommand.includes('what')) {
      speak("I can explain face, voice, gesture, and body pattern authentication. Just ask me about any of these!");
    } else {
      speak("I didn't understand that. Try asking about face, voice, gesture, or body authentication!");
    }
  };

  const speak = (text: string) => {
    console.log('Speaking:', text);
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  };

  const startListening = () => {
    console.log('Starting voice recognition...');
    if (recognition && !isListening && isSupported) {
      setTranscript('');
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
        speak("Sorry, I couldn't start listening. Please try again.");
      }
    } else if (!isSupported) {
      speak("Voice recognition is not supported in your browser. Please try a different browser.");
    }
  };

  const stopListening = () => {
    console.log('Stopping voice recognition...');
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    console.log('Stopping speech...');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-100 to-cyan-100 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: isListening ? [1, 1.2, 1] : 1,
                rotate: isSpeaking ? [0, 10, -10, 0] : 0
              }}
              transition={{ 
                repeat: isListening || isSpeaking ? Infinity : 0,
                duration: 1
              }}
              className="text-4xl"
            >
              🤖
            </motion.div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={isListening ? "destructive" : "default"}
                  onClick={isListening ? stopListening : startListening}
                  className="bg-purple-500 hover:bg-purple-600"
                  disabled={!isSupported}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? "Stop" : "Ask"}
                </Button>
                
                <Button
                  size="sm"
                  variant={isSpeaking ? "destructive" : "outline"}
                  onClick={isSpeaking ? stopSpeaking : () => speak("Hello! I'm your AI guide. Ask me about biometric authentication!")}
                  disabled={!isSpeaking && isListening}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? "Quiet" : "Demo"}
                </Button>
              </div>
              
              {transcript && (
                <div className="text-xs bg-white/50 rounded p-2 max-w-48">
                  <p className="text-gray-700">"{transcript}"</p>
                </div>
              )}
              
              <div className="text-xs text-gray-600">
                {!isSupported ? "❌ Not supported" :
                 isListening ? "🎤 Listening..." : 
                 isSpeaking ? "🔊 Speaking..." : 
                 "💬 Ask me anything!"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoiceAssistant;
