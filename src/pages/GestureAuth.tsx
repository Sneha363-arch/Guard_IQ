
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, HandIcon, Shield, CheckCircle, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const GestureAuth = () => {
  const navigate = useNavigate();
  const { user, isRegistering, addBiometricData, verifyBiometric, getRegisteredBiometrics } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedGesture, setSelectedGesture] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const gestures = [
    { value: "peace", label: "Peace Sign (✌️)", emoji: "✌️" },
    { value: "thumbs_up", label: "Thumbs Up (👍)", emoji: "👍" },
    { value: "open_palm", label: "Open Palm (🖐️)", emoji: "🖐️" },
    { value: "fist", label: "Fist (✊)", emoji: "✊" },
    { value: "ok_sign", label: "OK Sign (👌)", emoji: "👌" }
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if previous biometric was completed
    if (isRegistering) {
      const registeredBiometrics = getRegisteredBiometrics();
      if (!registeredBiometrics.includes('voice')) {
        navigate("/voice-auth");
        return;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, navigate, isRegistering, getRegisteredBiometrics, stream]);

  const startDetection = async () => {
    if (!selectedGesture) return;
    
    try {
      console.log("Starting gesture detection for:", selectedGesture);
      
      // Start camera for gesture detection
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        };
      }
      
      setIsDetecting(true);
      toast.success("Camera started - show your gesture clearly");
      
      // Simulate gesture detection
      setTimeout(() => {
        handleGestureDetected(mediaStream);
      }, 5000); // 5 seconds to show gesture
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const handleGestureDetected = async (mediaStream: MediaStream) => {
    console.log('Gesture detected, processing...');
    setIsDetecting(false);
    
    // Generate gesture data
    const gestureData = {
      landmarks: Array.from({ length: 21 }, () => [Math.random() * 640, Math.random() * 480]), // Simulate hand landmarks
      gestureType: selectedGesture,
      confidence: 0.92,
      timestamp: new Date().toISOString()
    };

    try {
      if (isRegistering) {
        // Register mode - save the gesture data
        addBiometricData('gesture', gestureData);
        setIsVerified(true);
        toast.success("Gesture registered successfully!");
        
        setTimeout(() => {
          navigate("/body-auth");
        }, 2000);
      } else {
        // Login mode - verify against stored data
        const isValid = await verifyBiometric('gesture', gestureData);
        
        if (isValid) {
          setIsVerified(true);
          toast.success("Gesture verified successfully!");
          
          setTimeout(() => {
            navigate("/body-auth");
          }, 2000);
        } else {
          toast.error("Gesture verification failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Gesture processing error:', error);
      toast.error("Gesture processing failed. Please try again.");
    } finally {
      // Clean up camera
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/voice-auth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Voice Auth
            </Link>
          </Button>
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-500 mr-2" />
            <span className="text-xl font-bold">BioQuantumGate</span>
          </div>
        </div>

        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HandIcon className="w-8 h-8 text-purple-500" />
            </div>
            <CardTitle className="text-2xl">Gesture Recognition</CardTitle>
            <CardDescription>
              {isRegistering ? "Register your gesture for secure authentication" : "Verify your gesture identity"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Gesture Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Choose your gesture:</label>
                <Select value={selectedGesture} onValueChange={setSelectedGesture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gesture" />
                  </SelectTrigger>
                  <SelectContent>
                    {gestures.map((gesture) => (
                      <SelectItem key={gesture.value} value={gesture.value}>
                        <span className="flex items-center space-x-2">
                          <span className="text-lg">{gesture.emoji}</span>
                          <span>{gesture.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Camera/Detection Area */}
              <div className="bg-purple-50 p-8 rounded-lg text-center">
                {selectedGesture && (
                  <div className="mb-6">
                    <p className="text-lg font-medium mb-2">Show this gesture to the camera:</p>
                    <div className="text-6xl mb-2">
                      {gestures.find(g => g.value === selectedGesture)?.emoji}
                    </div>
                    <p className="text-purple-600 font-semibold">
                      {gestures.find(g => g.value === selectedGesture)?.label}
                    </p>
                  </div>
                )}

                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4 overflow-hidden">
                  {isDetecting ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : isVerified ? (
                    <div className="text-center text-green-600">
                      <CheckCircle className="w-16 h-16 mx-auto mb-2" />
                      <p className="font-semibold">Gesture verified!</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>Camera feed will appear here</p>
                    </div>
                  )}
                </div>

                {isDetecting && (
                  <div className="text-purple-600 font-semibold">
                    <HandIcon className="w-6 h-6 mx-auto mb-2 animate-pulse" />
                    <p>Hold your gesture steady for 5 seconds...</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Hold your gesture clearly in front of the camera</li>
                  <li>• Ensure good lighting conditions</li>
                  <li>• Keep your hand steady for 5 seconds</li>
                  <li>• Make sure your entire hand is visible</li>
                </ul>
              </div>

              {/* Actions */}
              {!isDetecting && !isVerified && (
                <Button 
                  onClick={startDetection}
                  disabled={!selectedGesture}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <HandIcon className="w-4 h-4 mr-2" />
                  Start Detection
                </Button>
              )}

              {isDetecting && (
                <Button disabled className="w-full bg-purple-500 text-white">
                  Detecting Gesture...
                </Button>
              )}

              {isVerified && (
                <div className="text-center">
                  <p className="text-green-600 font-semibold mb-2">
                    Gesture {isRegistering ? "registration" : "verification"} successful!
                  </p>
                  <p className="text-sm text-muted-foreground">Proceeding to body pattern analysis...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GestureAuth;
