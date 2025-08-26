import { useRef, useState } from "react";
import * as faceapi from "face-api.js";

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start the camera and play video
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // IMPORTANT: explicitly play video
        await videoRef.current.play().catch((err) => {
          console.error("Auto-play blocked:", err);
        });
      }
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError("Camera access denied or unavailable");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  // Capture snapshot
  const captureImage = (): string | null => {
    if (!videoRef.current || videoRef.current.videoWidth === 0) {
      console.error("No video frame available yet.");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  };


  // Load face-api.js models (call once before using encoding)
  const loadModels = async () => {
    const MODEL_URL = '/models'; // Place models in public/models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
  };

  // Generate real face encoding from video frame
  const generateFaceEncoding = async (): Promise<number[] | null> => {
    if (!videoRef.current) return null;
    const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    if (!detections || !detections.descriptor) return null;
    return Array.from(detections.descriptor);
  };

  return { videoRef, isActive, error, startCamera, stopCamera, captureImage, generateFaceEncoding, loadModels };
};
