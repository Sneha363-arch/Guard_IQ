
import { useState, useRef, useCallback } from 'react';

export const useMicrophone = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      console.log('Starting voice recording...');
      
      // Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      chunksRef.current = [];
      startTimeRef.current = Date.now();
      
      // Check supported MIME types
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Let browser choose
          }
        }
      }
      
      const options = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('Recording stopped, processing audio...');
        const recordingDuration = (Date.now() - startTimeRef.current) / 1000;
        setDuration(recordingDuration);
        
        const audioBlob = new Blob(chunksRef.current, { 
          type: mimeType || 'audio/webm' 
        });
        const reader = new FileReader();
        reader.onload = () => {
          const audioDataUrl = reader.result as string;
          setAudioData(audioDataUrl);
          console.log('Audio processed successfully, duration:', recordingDuration);
        };
        reader.readAsDataURL(audioBlob);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording failed');
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      console.log('Recording started successfully');
      
      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Microphone access denied';
      setError(errorMessage);
      console.error('Microphone error:', err);
      throw new Error(errorMessage);
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Generate voice pattern simulation (in real app, use speech processing libraries)
  const generateVoicePattern = useCallback((audioData: string, duration: number): string => {
    // Simulate voice pattern extraction
    const features = {
      duration,
      pitch: Math.random() * 100 + 80, // 80-180 Hz
      amplitude: Math.random() * 0.8 + 0.2, // 0.2-1.0
      spectralCentroid: Math.random() * 2000 + 1000, // 1000-3000 Hz
      mfcc: Array.from({ length: 13 }, () => Math.random() * 2 - 1), // 13 MFCC coefficients
      timestamp: Date.now()
    };
    return JSON.stringify(features);
  }, []);

  return {
    isRecording,
    audioData,
    error,
    duration,
    startRecording,
    stopRecording,
    generateVoicePattern
  };
};
