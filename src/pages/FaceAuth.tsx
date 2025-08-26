import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const FaceAuth = () => {
  const navigate = useNavigate();
  const { user, isRegistering, addBiometricData, verifyBiometric } = useAuth();
  const { videoRef, isActive, error, startCamera, stopCamera, captureImage, generateFaceEncoding, loadModels } = useCamera();

  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    return () => {
      stopCamera();
    };
  }, [user, navigate, stopCamera]);

  // Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Start camera and load models
  const handleStartCamera = async () => {
    await loadModels();
    await startCamera();
    toast.success("Camera and face models ready");
  };

  // Capture face and generate encoding
  const handleCaptureFace = async () => {
    if (!isActive) {
      toast.error("Start the camera first");
      return;
    }

    setIsProcessing(true);
    setCountdown(3);

    setTimeout(async () => {
      const imageData = captureImage();
      if (!imageData) {
        toast.error("Failed to capture image. Try again.");
        setIsProcessing(false);
        setCountdown(0);
        return;
      }

      setCapturedPreview(imageData);
      let faceEncoding: number[] | null = null;
      try {
        faceEncoding = await generateFaceEncoding();
      } catch (err) {
        toast.error("Face encoding failed. Ensure your face is visible and models are loaded.");
        setIsProcessing(false);
        setCountdown(0);
        return;
      }
      if (!faceEncoding) {
        toast.error("No face detected. Please try again.");
        setIsProcessing(false);
        setCountdown(0);
        return;
      }

      const faceData = {
        encoding: faceEncoding,
        imageData,
        timestamp: new Date().toISOString(),
      };

      if (isRegistering) {
        addBiometricData("face", faceData);
        setIsVerified(true);
        toast.success("Face registered successfully!");
        setTimeout(() => navigate("/voice-auth"), 1500);
      } else {
        const isValid = await verifyBiometric("face", faceData);
        if (isValid) {
          setIsVerified(true);
          toast.success("Face verified successfully!");
          setTimeout(() => navigate("/voice-auth"), 1500);
        } else {
          toast.error("Face verification failed. Please try again.");
        }
      }

      setIsProcessing(false);
      setCountdown(0);
    }, 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to={isRegistering ? "/register" : "/login"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-500 mr-2" />
            <span className="text-xl font-bold">BioQuantumGate</span>
          </div>
        </div>

        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-cyan-500" />
            </div>
            <CardTitle className="text-2xl">Facial Recognition</CardTitle>
            <CardDescription>
              {isRegistering ? "Register your face for secure authentication" : "Verify your facial identity"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Camera */}
              <div className="relative">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {error ? (
                    <div className="text-center text-red-500">
                      <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                      <p>{error}</p>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover rounded-lg"
                      style={{ transform: "scaleX(-1)" }}
                    />
                  )}
                </div>

                {countdown > 0 && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-6xl font-bold animate-pulse">{countdown}</div>
                  </div>
                )}

                {isVerified && (
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                )}
              </div>

              {/* Debug: Captured Preview */}
              {capturedPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Last captured snapshot:</p>
                  <img src={capturedPreview} alt="Captured face" className="rounded-lg border" />
                </div>
              )}

              {/* Instructions */}
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Position your face in the center of the frame</li>
                  <li>• Ensure good lighting conditions</li>
                  <li>• Look directly at the camera</li>
                  <li>• Remove obstructions (glasses, hat)</li>
                  <li>• Stay still during countdown</li>
                </ul>
              </div>

              {/* Buttons */}
              {!isActive ? (
                <Button onClick={handleStartCamera} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  Start Camera
                </Button>
              ) : !isVerified && !isProcessing ? (
                <Button onClick={handleCaptureFace} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  Capture Face
                </Button>
              ) : isProcessing ? (
                <Button disabled className="w-full bg-cyan-500 text-white">
                  {countdown > 0 ? `Capturing in ${countdown}...` : "Processing..."}
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FaceAuth;
