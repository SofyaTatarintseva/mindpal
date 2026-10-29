import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Sun, CloudSun, Sunset, Moon } from 'lucide-react';
import MoodChartWidget from '../components/MoodChartWidget';
import HealthChecklistWidget from '../components/HealthChecklistWidget';
import TasksWidget from '../components/TasksWidget';
import BotsWidget from '../components/BotsWidget';

const Home = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Доброе утро!', icon: <Sun className="text-amber-400" /> };
    if (hour >= 12 && hour < 18) return { text: 'Добрый день!', icon: <CloudSun className="text-blue-400" /> };
    if (hour >= 18 && hour < 23) return { text: 'Добрый вечер!', icon: <Sunset className="text-orange-400" /> };
    return { text: 'Доброй ночи!', icon: <Moon className="text-indigo-400" /> };
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Приветствие */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              {greeting.icon} {greeting.text}
            </h1>
            <p className="text-slate-500 mt-1">Вот твой дашборд на сегодня.</p>
          </div>
        </div>

        {/* ПЕРВЫЙ РЯД: График + Задачи */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <MoodChartWidget />
          </div>
          <div className="md:col-span-1">
            <TasksWidget />
          </div>
        </div>

        {/* ВТОРОЙ РЯД: Боты + Здоровье (друг под другом) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 space-y-6">
            <BotsWidget />
            <HealthChecklistWidget />
          </div>

          {/* Карточки-ссылки теперь занимают 2 колонки и стоят рядом с ботами/здоровьем */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/emotions" className="bg-blue-50 p-6 rounded-3xl hover:bg-blue-100 transition-colors group flex flex-col justify-between min-h-[160px]">
              <div>
                <Sparkles className="text-blue-500 mb-3" size={28} />
                <h2 className="text-lg font-semibold text-slate-800">Дневник эмоций</h2>
                <p className="text-slate-500 text-sm mt-1">Записать состояние</p>
              </div>
              <ArrowRight className="text-blue-500 mt-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link to="/tasks" className="bg-emerald-50 p-6 rounded-3xl hover:bg-emerald-100 transition-colors group flex flex-col justify-between min-h-[160px]">
              <div>
                <Sparkles className="text-emerald-500 mb-3" size={28} />
                <h2 className="text-lg font-semibold text-slate-800">Декомпозитор</h2>
                <p className="text-slate-500 text-sm mt-1">Разбить большую задачу</p>
              </div>
              <ArrowRight className="text-emerald-500 mt-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;