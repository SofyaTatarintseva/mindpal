import { useEffect, useState } from 'react';
import { Circle, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Step {
  text: string;
  completed: boolean;
}

const TasksWidget = () => {
  const [tasks, setTasks] = useState<Step[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mindpal_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  const activeTasks = tasks.filter(t => !t.completed).slice(0, 3); // Показываем только 3 невыполненные

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <ListChecks size={18} className="text-emerald-500" /> Задачи
        </h3>
        <Link to="/tasks" className="text-xs text-blue-500 hover:underline">Все задачи</Link>
      </div>
      
      {activeTasks.length === 0 ? (
        <p className="text-slate-400 text-sm">Нет активных задач. <Link to="/tasks" className="text-blue-500 hover:underline">Создать</Link></p>
      ) : (
        <div className="space-y-3">
          {activeTasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <Circle size={16} className="text-slate-300 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{task.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksWidget;