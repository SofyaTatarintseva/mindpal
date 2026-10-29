import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import type { HistoryItem } from './HistoryList';

const EMOTION_CONFIG: Record<string, { color: string; label: string }> = {
  joy: { color: '#FFD93D', label: 'Радость' },
  sadness: { color: '#6C9BCF', label: 'Печаль' },
  anxiety: { color: '#FF9F43', label: 'Тревога' },
  anger: { color: '#FF6B6B', label: 'Злость' },
  calm: { color: '#2ED573', label: 'Спокойствие' },
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload || !payload.dominant) return null;
  
  const color = EMOTION_CONFIG[payload.dominant]?.color || '#94a3b8';
  
  return (
    <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
  );
};

const MoodChartWidget = () => {
  const [data, setData] = useState<any[]>([]);
  const [overallMood, setOverallMood] = useState<string | null>(null);
  const [overallMoodColor, setOverallMoodColor] = useState<string>('bg-blue-50 text-blue-600');

  useEffect(() => {
    const saved = localStorage.getItem('mindpal_history');
    if (saved) {
      try {
        const history: HistoryItem[] = JSON.parse(saved);
        
        const chartData = history
          .slice(0, 7)
          .reverse()
          .map(item => {
            const positive = item.emotions.joy + item.emotions.calm;
            const negative = item.emotions.sadness + item.emotions.anxiety + item.emotions.anger;
            const balance = Math.round((positive - negative) / 2);
            
            // Находим доминирующую эмоцию и её процент
            let maxEmotion = 'calm';
            let maxValue = -1;
            Object.entries(item.emotions).forEach(([key, value]) => {
              if (value > maxValue) {
                maxValue = value;
                maxEmotion = key;
              }
            });

            return {
              date: item.date ? item.date.split(',')[0] : '—', 
              balance: balance,
              dominant: maxEmotion,
              dominantValue: Math.round(maxValue), // <-- сохраняем процент доминирующей эмоции
            };
          });
        
        setData(chartData);

        if (chartData.length > 0) {
          const moodCounts: Record<string, number> = {};
          chartData.forEach(item => {
            moodCounts[item.dominant] = (moodCounts[item.dominant] || 0) + 1;
          });

          // Находим самую частую
          const mostFrequent = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
          const moodConfig = EMOTION_CONFIG[mostFrequent];
            
          setOverallMood(moodConfig?.label || mostFrequent);
            
          // Красим бейдж в цвет этой эмоции (для фона используем opacity, для текста — сам цвет)
          // Можно сделать проще: задать классы вручную
          if (mostFrequent === 'joy') setOverallMoodColor('bg-yellow-50 text-yellow-600');
          else if (mostFrequent === 'sadness') setOverallMoodColor('bg-blue-50 text-blue-600');
          else if (mostFrequent === 'anxiety') setOverallMoodColor('bg-orange-50 text-orange-600');
          else if (mostFrequent === 'anger') setOverallMoodColor('bg-red-50 text-red-600');
          else setOverallMoodColor('bg-emerald-50 text-emerald-600'); // calm
        }
      } catch (e) {
        console.error('Ошибка парсинга истории для графика', e);
      }
    }
  }, []);

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400 text-sm">
        Пока нет данных для графика. Сделай запись в Дневнике эмоций.
      </div>
    );
  }

  const lineColor = '#cbd5e1';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">📊 Твой эмоциональный баланс</h3>
        {overallMood && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${overallMoodColor}`}>
            В целом: {overallMood}
          </span>
        )}
      </div>

      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              angle={0}
              textAnchor="middle"
              height={50}
            />
            
            <YAxis 
              domain={[-100, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
            />
            
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
            
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                // payload[0].payload — это объект с нашими данными (date, balance, dominant, dominantValue)
                  const data = payload[0].payload;
                
                  if (data && data.dominant) {
                    const emotionLabel = EMOTION_CONFIG[data.dominant]?.label || data.dominant;
                    return (
                      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-sm">
                        <p className="text-slate-400 mb-1">Время: {label}</p>
                        <p className="font-semibold text-slate-800">
                          Настроение: {emotionLabel} ({data.dominantValue}%)
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />
            
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke={lineColor} 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={<CustomDot />} 
              activeDot={{ r: 7 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
        {Object.entries(EMOTION_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
            <span className="text-slate-500">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodChartWidget;