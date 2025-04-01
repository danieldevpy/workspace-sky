'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ScreenRecorderOptions {
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  mimeType?: string;
  downloadOnStop?: boolean;
  audio?: boolean;
}

export const useScreenRecorder = (options?: ScreenRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Corrected browser support check
  const checkScreenRecordingSupport = () => {
    return (
      typeof navigator !== 'undefined' &&
      'mediaDevices' in navigator &&
      'getDisplayMedia' in navigator.mediaDevices &&
      typeof MediaRecorder !== 'undefined'
    );
  };

  const getSupportedMimeType = () => {
    const possibleTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm;codecs=avc1,opus',
      'video/webm',
      'video/mp4',
    ];

    return possibleTypes.find(mimeType => 
      MediaRecorder.isTypeSupported(mimeType)
    ) || 'video/webm';
  };

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) {
      recordedChunks.current.push(event.data);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (recordedChunks.current.length === 0) {
      options?.onError?.(new Error('No recording data available'));
      return;
    }

    const blob = new Blob(recordedChunks.current, {
      type: mediaRecorder.current?.mimeType || 'video/webm'
    });

    recordedChunks.current = [];

    if (options?.onStop) {
      options.onStop(blob);
    } else if (options?.downloadOnStop !== false) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.${blob.type.split('/')[1].split(';')[0] || 'webm'}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
    mediaStream.current?.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setRecordingError(null);
      recordedChunks.current = [];

      if (!checkScreenRecordingSupport()) {
        throw new Error('Screen recording API not supported in this browser');
      }

      if (!window.isSecureContext) {
        throw new Error('Screen recording requires HTTPS or localhost');
      }

      const constraints: DisplayMediaStreamOptions = {
        video: {
          displaySurface: 'browser',
          frameRate: { ideal: 30 },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: options?.audio ? { echoCancellation: false } : false
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (err) {
        // Fallback to minimal constraints
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: options?.audio
        });
      }

      const mimeType = options?.mimeType || getSupportedMimeType();
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error(`MIME type ${mimeType} not supported`);
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

      mediaStream.current = stream;
      mediaRecorder.current = recorder;

      recorder.addEventListener('dataavailable', handleDataAvailable);
      recorder.addEventListener('stop', handleStop);
      recorder.start(1000);

      setIsRecording(true);
      options?.onStart?.();
    } catch (error) {
      console.error('Recording error:', error);
      let errorMessage = 'Failed to start recording';

      if (error instanceof DOMException) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setRecordingError(errorMessage);
      setIsRecording(false);
      options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [handleDataAvailable, handleStop, options, stopRecording]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    recordingError,
    clearError: () => setRecordingError(null),
    isSupported: checkScreenRecordingSupport()
  };
};