export function speak(text) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) return resolve();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
}

export function createRecognizer({ onResult, onEnd }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const text = e.results?.[0]?.[0]?.transcript || "";
    onResult?.(text);
  };
  rec.onend = () => onEnd?.();
  return rec;
}
