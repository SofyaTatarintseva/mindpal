import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Импортируем Link для навигации
import { ArrowLeft, Sparkles, AlertCircle, Heart } from 'lucide-react';

// Импорты твоих компонентов
import InputForm from '../components/InputForm';
import ResultCard from '../components/ResultCard';
import HistoryList, { type HistoryItem } from '../components/HistoryList';
import EmotionFlower from '../components/EmotionFlower';
import { analyzeEmotions, type AnalysisResult } from '../utils/api';

const EmotionDiaryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Загружаем историю из localStorage при старте
  useEffect(() => {
    const saved = localStorage.getItem('mindpal_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка загрузки истории', e);
      }
    }
  }, []);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeEmotions(text);
      setResult(data);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('ru-RU', { 
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        }),
        text,
        summary: data.summary,
        emotions: data.emotions,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('mindpal_history', JSON.stringify(updatedHistory));

    } catch (err: any) {
      setError(err.message || 'Что-то пошло не так. Попробуй еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Удалить всю историю записей?')) {
      setHistory([]);
      localStorage.removeItem('mindpal_history');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult({
      emotions: item.emotions,
      summary: item.summary,
      recommendation: 'Это запись из прошлого. Прокрути вверх, чтобы проанализировать новый день.',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Кнопка возврата на главную */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> На главную
        </Link>
      </div>

      {/* Шапка */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
          <Sparkles className="text-blue-500" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Дневник эмоций</h1>
        <p className="text-slate-500 text-lg">Расскажи, как прошел день.</p>
      </div>

      <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />

      {error && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center">
            <EmotionFlower data={result.emotions} />
          </div>
          <ResultCard 
            summary={result.summary} 
            recommendation={result.recommendation} 
          />
        </div>
      )}

      {history.length > 0 && (
        <HistoryList 
          history={history} 
          onClear={handleClearHistory} 
          onSelect={handleSelectHistory} 
        />
      )}

      <footer className="mt-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <span>Сделано с</span>
        <Heart size={14} className="text-red-400 fill-red-400" />
        <span>для твоего ментального здоровья</span>
      </footer>
    </div>
  );
};

export default EmotionDiaryPage;