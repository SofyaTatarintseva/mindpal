import React, { useState } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false); // Заглушка для голоса

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 2 && !isLoading) {
      onSubmit(text);
      setText(''); // Очищаем поле после отправки
    }
  };

  // Заглушка для голосового ввода (позже заменим на хук useVoice)
  const handleVoiceClick = () => {
    setIsListening(!isListening);
    // Здесь будет вызов startListening из хука useVoice
    alert('Голосовой ввод будет добавлен на следующем шаге!');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-2 transition-all duration-300 focus-within:shadow-2xl focus-within:border-blue-200">
        
        {/* Текстовое поле */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Как прошел твой день? Расскажи мне..."
          className="w-full h-32 p-4 text-gray-700 bg-transparent resize-none outline-none rounded-2xl placeholder:text-gray-400 text-lg"
          disabled={isLoading}
        />

        {/* Кнопки управления */}
        <div className="flex items-center justify-between px-2 pb-2">
          
          {/* Кнопка микрофона */}
          <button
            type="button"
            onClick={handleVoiceClick}
            disabled={isLoading}
            className={`p-3 rounded-full transition-colors duration-200 ${
              isListening 
                ? 'bg-red-100 text-red-500 animate-pulse' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title="Голосовой ввод"
          >
            <Mic size={20} />
          </button>

          {/* Счетчик символов и кнопка отправки */}
          <div className="flex items-center gap-4">
            <span className={`text-sm ${text.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
              {text.length} / 500
            </span>
            
            <button
              type="submit"
              disabled={text.trim().length < 3 || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-all duration-300 ${
                text.trim().length < 3 || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Анализ...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Анализировать
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InputForm;