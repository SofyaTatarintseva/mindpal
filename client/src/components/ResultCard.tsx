import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultCardProps {
  summary: string;
  recommendation: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ summary, recommendation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8 space-y-4"
    >
      {/* Блок с резюме (Summary) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-blue-600">
          <Sparkles size={18} />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Твое состояние</h3>
        </div>
        <p className="text-lg text-gray-800 font-medium leading-relaxed">
          «{summary}»
        </p>
      </div>

      {/* Блок с рекомендацией (Recommendation) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-amber-600">
          <Lightbulb size={18} />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Совет от ИИ</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {recommendation}
        </p>
      </div>
    </motion.div>
  );
};

export default ResultCard;
