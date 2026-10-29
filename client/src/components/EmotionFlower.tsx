import React from 'react';
import { motion } from 'framer-motion';

interface EmotionData {
  joy: number;
  sadness: number;
  anxiety: number;
  anger: number;
  calm: number;
}

const EmotionFlower = ({ data }: { data: EmotionData }) => {
  const colors = {
    joy: '#FFD93D',      // Солнечный
    sadness: '#6C9BCF',  // Голубой
    anxiety: '#FF9F43',  // Оранжевый
    anger: '#FF6B6B',    // Красный
    calm: '#2ED573',     // Зеленый
  };

  const emotions = Object.entries(data).map(([key, value], index) => {
    const angle = (index / 5) * 360 - 90; // Распределяем по кругу
    const radius = 30 + (value / 100) * 50; // Длина лепестка зависит от %
    const x = radius * Math.cos(angle * Math.PI / 180);
    const y = radius * Math.sin(angle * Math.PI / 180);

    return { key, value, x, y, color: colors[key as keyof typeof colors] };
  });

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Центр */}
      <div className="absolute w-16 h-16 bg-white rounded-full shadow-md z-10 flex items-center justify-center text-xs font-bold">
        Ты
      </div>

      {/* Лепестки */}
      {emotions.map((em) => (
        <motion.div
          key={em.key}
          className="absolute w-12 h-12 rounded-full opacity-80"
          style={{ backgroundColor: em.color }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{ scale: 1, x: em.x, y: em.y }}
          transition={{ duration: 0.5, delay: 0.1 * emotions.indexOf(em) }}
        >
          <span className="flex items-center justify-center h-full text-[10px] text-white font-bold">
            {Math.round(em.value)}%
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default EmotionFlower;