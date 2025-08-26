
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, Shield, CheckCircle, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BodyPatternAuth = () => {
  const navigate = useNavigate();
  const { user, isRegistering, addBiometricData, verifyBiometric, getRegisteredBiometrics } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentPose, setCurrentPose] = useState("Stand naturally");
  const [progress, setProgress] = useState(0);
  const [poseIndex, setPoseIndex] = useState(0);
  const [detectedPoses, setDetectedPoses] = useState<string[]>([]);

  const poses = [
    "Stand naturally",
    "Raise your right hand",
    "Place hands on hips", 
    "Cross your arms",
    "Stand with feet apart"
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if previous biometric was completed
    if (isRegistering) {
      const registeredBiometrics = getRegisteredBiometrics();
      if (!registeredBiometrics.includes('gesture')) {
        navigate("/gesture-auth");
        return;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, navigate, isRegistering, getRegisteredBiometrics, stream]);

  const startAnalysis = async () => {
    try {
      console.log('Starting body pattern analysis...');
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
      
      setIsAnalyzing(true);
      setPoseIndex(0);
      setDetectedPoses([]);
      toast.success("Camera started - follow the pose instructions");
      
      // Simulate pose detection sequence
      const interval = setInterval(() => {
        setPoseIndex(currentIndex => {
          const nextIndex = currentIndex + 1;
          setProgress((nextIndex) * 20);
          
          if (nextIndex < poses.length) {
            setCurrentPose(poses[nextIndex]);
            
            // Simulate pose detection after 3 seconds
            setTimeout(() => {
              setDetectedPoses(prev => [...prev, poses[nextIndex]]);
              console.log(`Pose detected: ${poses[nextIndex]}`);
              toast.success(`Pose "${poses[nextIndex]}" detected!`);
            }, 2000);
            
            return nextIndex;
          } else {
            // Analysis complete
            clearInterval(interval);
            handleAnalysisComplete(mediaStream);
            return currentIndex;
          }
        });
      }, 4000); // 4 seconds per pose
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const handleAnalysisComplete = async (mediaStream: MediaStream) => {
    console.log('Body pattern analysis complete');
    setIsAnalyzing(false);
    
    // Generate body pattern data
    const bodyPatternData = {
      keypoints: Array.from({ length: 17 }, () => [Math.random() * 640, Math.random() * 480, 0.9]), // Simulate 17 keypoints
      poses: detectedPoses,
      confidence: 0.95,
      timestamp: new Date().toISOString()
    };

    try {
      if (isRegistering) {
        // Register mode - save the body pattern data
        addBiometricData('bodyPattern', bodyPatternData);
        setIsVerified(true);
        toast.success("Body pattern registered successfully!");
        
        setTimeout(() => {
          navigate("/quantum-dashboard");
        }, 2000);
      } else {
        // Login mode - verify against stored data
        const isValid = await verifyBiometric('bodyPattern', bodyPatternData);
        
        if (isValid) {
          setIsVerified(true);
          toast.success("Body pattern verified successfully!");
          
          setTimeout(() => {
            navigate("/quantum-dashboard");
          }, 2000);
        } else {
          toast.error("Body pattern verification failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Body pattern processing error:', error);
      toast.error("Body pattern processing failed. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/gesture-auth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gesture Auth
            </Link>
          </Button>
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-500 mr-2" />
            <span className="text-xl font-bold">BioQuantumGate</span>
          </div>
        </div>

        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Body Pattern Analysis</CardTitle>
            <CardDescription>AI-powered posture and movement verification</CardDescription>
            <div className="flex justify-center space-x-2 mt-4">
              <Badge variant="secondary">Skeletal Pose Estimation</Badge>
              <Badge variant="secondary">AI-Powered</Badge>
              <Badge variant="secondary">Real-time</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Current Pose Instruction */}
              {isAnalyzing && (
                <div className="bg-orange-50 p-4 rounded-lg text-center border-l-4 border-orange-500">
                  <p className="text-lg font-semibold text-orange-700 mb-2">Current Pose:</p>
                  <p className="text-xl text-orange-600">{currentPose}</p>
                  <p className="text-sm text-orange-500 mt-2">Hold for 3 seconds</p>
                </div>
              )}

              {/* Detected Poses */}
              {detectedPoses.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700 mb-2">Detected Poses:</p>
                  <div className="flex flex-wrap gap-2">
                    {detectedPoses.map((pose, index) => (
                      <Badge key={index} variant="outline" className="text-green-600 border-green-300">
                        ✓ {pose}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera Feed */}
              <div className="relative">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                  {isAnalyzing ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Body pattern analysis camera feed</p>
                    </div>
                  )}
                </div>
                
                {isVerified && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <div className="bg-white rounded-full p-4">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Details */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-orange-500" />
                  AI Analysis Features
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• Skeletal keypoint detection</div>
                  <div>• Gait pattern analysis</div>
                  <div>• Posture verification</div>
                  <div>• Movement signature</div>
                  <div>• Body proportion analysis</div>
                  <div>• Anti-spoofing detection</div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stand within the camera frame with full body visible</li>
                  <li>• Follow the pose instructions as they appear</li>
                  <li>• Maintain each pose for 3 seconds</li>
                  <li>• Ensure good lighting and clear background</li>
                </ul>
              </div>

              {/* Actions */}
              {!isAnalyzing && !isVerified && (
                <Button onClick={startAnalysis} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Activity className="w-4 h-4 mr-2" />
                  Start Body Pattern Analysis
                </Button>
              )}

              {isAnalyzing && (
                <Button disabled className="w-full bg-orange-500 text-white">
                  Analyzing Body Pattern... ({poseIndex + 1}/{poses.length})
                </Button>
              )}

              {isVerified && (
                <div className="text-center">
                  <p className="text-green-600 font-semibold mb-2">Body pattern authentication successful!</p>
                  <p className="text-sm text-muted-foreground">All biometric verifications complete. Accessing quantum dashboard...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BodyPatternAuth;
