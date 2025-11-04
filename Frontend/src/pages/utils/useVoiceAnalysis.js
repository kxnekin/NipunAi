import { useEffect, useState } from 'react';

export function useVoiceAnalysis(stream) {
  const [voiceAlert, setVoiceAlert] = useState('');

  useEffect(() => {
    if (!stream) return;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function checkConfidence() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      if (avg < 15) setVoiceAlert('🎤 Speak louder');
      else if (avg > 180) setVoiceAlert('📢 Lower your voice');
      else setVoiceAlert('');
      requestAnimationFrame(checkConfidence);
    }
    checkConfidence();
  }, [stream]);

  return voiceAlert;
}
