import React from 'react';
import { History, Trash2, ChevronRight } from 'lucide-react';

// Тип для одной записи в истории
export interface HistoryItem {
  id: string;
  date: string;
  text: string;
  summary: string;
  emotions: {
    joy: number;
    sadness: number;
    anxiety: number;
    anger: number;
    calm: number;
  };
}

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onClear, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      {/* Заголовок и кнопка очистки */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-gray-600">
          <History size={20} />
          <h3 className="font-semibold">История записей</h3>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} />
          Очистить
        </button>
      </div>

      {/* Список карточек */}
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs text-gray-400 font-mono">{item.date}</span>
                {/* Мини-индикатор эмоций (просто цветные точки) */}
                <div className="flex gap-1">
                  {item.emotions.joy > 50 && <span className="w-2 h-2 rounded-full bg-yellow-400" title="Радость" />}
                  {item.emotions.sadness > 50 && <span className="w-2 h-2 rounded-full bg-blue-400" title="Печаль" />}
                  {item.emotions.anxiety > 50 && <span className="w-2 h-2 rounded-full bg-orange-400" title="Тревога" />}
                  {item.emotions.anger > 50 && <span className="w-2 h-2 rounded-full bg-red-400" title="Злость" />}
                  {item.emotions.calm > 50 && <span className="w-2 h-2 rounded-full bg-green-400" title="Спокойствие" />}
                </div>
              </div>
              <p className="text-sm text-gray-700 font-medium truncate">
                {item.summary}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;