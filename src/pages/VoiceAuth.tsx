
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mic, MicOff, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useMicrophone } from "@/hooks/useMicrophone";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const VoiceAuth = () => {
  const navigate = useNavigate();
  const { user, isRegistering, addBiometricData, verifyBiometric, getRegisteredBiometrics } = useAuth();
  const { isRecording, audioData, error, duration, startRecording, stopRecording, generateVoicePattern } = useMicrophone();
  const [isVerified, setIsVerified] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if previous biometric was completed
    if (isRegistering) {
      const registeredBiometrics = getRegisteredBiometrics();
      if (!registeredBiometrics.includes('face')) {
        navigate("/face-auth");
        return;
      }
    }
  }, [user, navigate, isRegistering, getRegisteredBiometrics]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (audioData && !isProcessing) {
      handleAudioProcessing();
    }
  }, [audioData]);

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      toast.success("Microphone permission granted");
    } catch (err) {
      toast.error("Microphone permission denied");
    }
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast.success("Recording started - speak the phrase clearly");
      
      // Auto stop after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 10000);
    } catch (err) {
      toast.error("Failed to start recording. Please check permissions.");
    }
  };

  const handleAudioProcessing = async () => {
    if (!audioData || isProcessing) return;

    setIsProcessing(true);
    console.log('Processing voice data...');

    try {
      // Check minimum recording duration
      if (duration < 2) {
        toast.error("Recording too short. Please speak for at least 2 seconds.");
        return;
      }

      // Generate voice pattern
      const voicePattern = generateVoicePattern(audioData, duration);
      const voiceData = {
        pattern: voicePattern,
        duration: duration,
        audioData: audioData
      };

      console.log('Voice data processed:', { duration, patternLength: voicePattern.length });

      if (isRegistering) {
        // Register mode - save the voice data
        addBiometricData('voice', voiceData);
        setIsVerified(true);
        toast.success("Voice registered successfully!");
        
        setTimeout(() => {
          navigate("/gesture-auth");
        }, 1500);
      } else {
        // Login mode - verify against stored data
        const isValid = await verifyBiometric('voice', voiceData);
        
        if (isValid) {
          setIsVerified(true);
          toast.success("Voice verified successfully!");
          
          setTimeout(() => {
            navigate("/gesture-auth");
          }, 1500);
        } else {
          toast.error("Voice verification failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      toast.error("Voice processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/face-auth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Face Auth
            </Link>
          </Button>
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-500 mr-2" />
            <span className="text-xl font-bold">BioQuantumGate</span>
          </div>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Voice Authentication</CardTitle>
            <CardDescription>
              {isRegistering ? "Register your voice for secure authentication" : "Verify your voice identity"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Voice Recording Area */}
              <div className="bg-green-50 p-8 rounded-lg text-center">
                <p className="text-lg font-medium mb-4">Please read this phrase clearly:</p>
                <div className="bg-white p-4 rounded border-l-4 border-green-500 mb-6">
                  <p className="text-xl italic text-green-600">
                    "My voice is my passport, verify me securely with quantum protection"
                  </p>
                </div>
                
                {isRecording && (
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-semibold">
                      Recording... {recordingTime}s / 10s
                    </span>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="font-semibold">Processing voice pattern...</span>
                  </div>
                )}
                
                {isVerified && (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Voice verified successfully!</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <AlertCircle className="w-6 h-6" />
                    <span>Error: {error}</span>
                  </div>
                )}

                {duration > 0 && !isRecording && !isVerified && (
                  <div className="text-sm text-gray-600">
                    Last recording: {duration.toFixed(1)}s
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Speak clearly and at normal volume</li>
                  <li>• Ensure you're in a quiet environment</li>
                  <li>• Read the phrase exactly as shown</li>
                  <li>• Speak for at least 2-3 seconds</li>
                  <li>• Recording will automatically stop after 10 seconds</li>
                </ul>
              </div>

              {/* Microphone Permission */}
              {!hasPermission && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-800 font-medium">Microphone permission required</p>
                  <Button 
                    onClick={requestPermission}
                    className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Grant Permission
                  </Button>
                </div>
              )}

              {/* Actions */}
              {hasPermission && !isRecording && !isVerified && !isProcessing && (
                <Button 
                  onClick={handleStartRecording} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <Button 
                  onClick={stopRecording}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}

              {isProcessing && (
                <Button disabled className="w-full bg-green-500 text-white">
                  Processing Voice Pattern...
                </Button>
              )}

              {isVerified && (
                <div className="text-center">
                  <p className="text-green-600 font-semibold mb-2">
                    Voice {isRegistering ? "registration" : "verification"} successful!
                  </p>
                  <p className="text-sm text-muted-foreground">Proceeding to gesture recognition...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceAuth;
