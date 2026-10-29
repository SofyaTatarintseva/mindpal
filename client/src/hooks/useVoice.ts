// client/src/hooks/useVoice.ts
import { useState } from 'react';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Ваш браузер не поддерживает голосовой ввод');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.start();
  };

  return { isListening, transcript, startListening };
};