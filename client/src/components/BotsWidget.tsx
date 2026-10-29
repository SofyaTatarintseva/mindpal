import { Shield, Newspaper, ExternalLink } from 'lucide-react';

const BotsWidget = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-semibold text-slate-800 mb-4">🤖 Твои боты</h3>
      <div className="space-y-3">
        <a href="https://t.me/buddy_emergency_bot" target="_blank" rel="noopener noreferrer" 
          className="flex items-center justify-between p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-amber-500" />
            <span className="text-sm font-medium text-slate-700">Бот-сторож</span>
          </div>
          <ExternalLink size={14} className="text-amber-400 group-hover:text-amber-600" />
        </a>
        <a href="https://t.me/news_agregatebot" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-purple-500" />
            <span className="text-sm font-medium text-slate-700">Новостной дайджест</span>
          </div>
          <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600" />
        </a>
      </div>
    </div>
  );
};

export default BotsWidget;