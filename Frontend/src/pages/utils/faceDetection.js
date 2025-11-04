// Hook to detect head movement, gaze, posture
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';
import { useEffect, useState } from 'react';

export function useFaceDetection(videoRef) {
  const [warning, setWarning] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function detectFace() {
      const model = await blazeface.load();
      async function analyze() {
        if (!isMounted) return;
        const predictions = await model.estimateFaces(videoRef.current, false);
        if (predictions.length > 0) {
          const face = predictions[0];
          const centerX = face.landmarks[0][0];
          // Example threshold
          if (centerX < 150) setWarning('⚠️ You are turning left — face the camera');
          else if (centerX > 350) setWarning('⚠️ You are turning right — maintain eye contact');
          else setWarning('');
        }
        requestAnimationFrame(analyze);
      }
      analyze();
    }
    detectFace();
    return () => { isMounted = false };
  }, [videoRef]);

  return warning;
}
