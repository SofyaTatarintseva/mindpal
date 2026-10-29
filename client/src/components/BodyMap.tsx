import React from 'react';

interface BodyMapProps {
  // Объект, где ключ — зона тела, значение — true/false (сдано или нет)
  activeZones: Record<string, boolean>;
}

const BodyMap: React.FC<BodyMapProps> = ({ activeZones }) => {
  // Цвета для активных зон (можно менять под свой дизайн)
  const activeColor = '#f43f5e'; // rose-500
  const inactiveColor = '#f1f5f9'; // slate-100

  const getColor = (zone: string) => activeZones[zone] ? activeColor : inactiveColor;

  return (
    <div className="flex justify-center items-center h-64 w-full">
      <svg viewBox="0 0 200 400" className="h-full w-auto drop-shadow-sm">
        {/* Контур тела (общий фон) */}
        <path 
          d="M100 20 C115 20 125 30 125 45 C125 60 115 70 100 70 C85 70 75 60 75 45 C75 30 85 20 100 20 Z" 
          fill="#e2e8f0" 
        />
        
        {/* --- ЗОНЫ --- */}
        
        {/* Голова (Мозг, зрение) */}
        <path d="M100 20 C115 20 125 30 125 45 C125 60 115 70 100 70 C85 70 75 60 75 45 C75 30 85 20 100 20 Z" fill={getColor('head')} opacity="0.8" />
        
        {/* Шея (Щитовидная железа) */}
        <rect x="90" y="70" width="20" height="20" rx="5" fill={getColor('neck')} opacity="0.8" />
        
        {/* Грудная клетка (Сердце, легкие) */}
        <path d="M75 90 L125 90 L135 140 L65 140 Z" fill={getColor('chest')} opacity="0.8" />
        
        {/* Живот (Желудок, печень, почки) */}
        <path d="M65 140 L135 140 L130 200 L70 200 Z" fill={getColor('abdomen')} opacity="0.8" />
        
        {/* Таз (Гинекология, простата) */}
        <path d="M70 200 L130 200 L120 260 L80 260 Z" fill={getColor('pelvis')} opacity="0.8" />
        
        {/* Руки */}
        <path d="M65 90 L40 150 L45 250 L55 250 L50 150 L75 100 Z" fill={getColor('arms')} opacity="0.5" />
        <path d="M135 90 L160 150 L155 250 L145 250 L150 150 L125 100 Z" fill={getColor('arms')} opacity="0.5" />
        
        {/* Ноги */}
        <path d="M80 260 L70 380 L85 380 L95 260 Z" fill={getColor('legs')} opacity="0.5" />
        <path d="M120 260 L130 380 L115 380 L105 260 Z" fill={getColor('legs')} opacity="0.5" />
      </svg>
    </div>
  );
};

export default BodyMap;