import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Circle } from 'lucide-react';

interface Step {
  text: string;
  completed: boolean;
}

interface DecomposeResult {
  taskTitle: string;
  steps: string[];
  encouragement: string;
}

const TaskDecomposer = () => {
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DecomposeResult | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Step[]>([]);
  useEffect(() => {
    const savedSteps = localStorage.getItem('mindpal_tasks');
    const savedResult = localStorage.getItem('mindpal_task_result');
    if (savedSteps) {
      setCheckedSteps(JSON.parse(savedSteps));
    }
    if (savedResult) {
      setResult(JSON.parse(savedResult)); // <-- восстанавливаем заголовок и совет
    }}, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.length < 3) return;

    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');
      
      const data: DecomposeResult = await response.json();
      setResult(data);
      const newSteps = data.steps.map(s => ({ text: s, completed: false }));
      setCheckedSteps(newSteps);
      localStorage.setItem('mindpal_tasks', JSON.stringify(newSteps));
      localStorage.setItem('mindpal_task_result', JSON.stringify(data)); // <-- новое
    } catch {
      alert('Не удалось разбить задачу. Попробуй еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (index: number) => {
    const newSteps = [...checkedSteps];
    newSteps[index].completed = !newSteps[index].completed;
    setCheckedSteps(newSteps);
    localStorage.setItem('mindpal_tasks', JSON.stringify(newSteps)); 
    localStorage.setItem('mindpal_tasks', JSON.stringify(newSteps)); 
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> На главную
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Декомпозитор задач</h1>
          <p className="text-slate-500 mb-6">Напиши большую задачу, и ИИ разобьет её на маленькие шаги.</p>

          <form onSubmit={handleSubmit} className="mb-8">
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Например: Найти новую работу в IT..."
              className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={task.length < 3 || isLoading}
              className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 className="animate-spin" size={20} /> Разбиваю...</> : 'Разбить на шаги'}
            </button>
          </form>

          {/* Результат */}
          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">{result.taskTitle}</h2>
              
              <div className="space-y-3 mb-6">
                {checkedSteps.map((step, index) => (
                  <div 
                    key={index} 
                    onClick={() => toggleStep(index)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      step.completed ? 'bg-emerald-50 text-slate-400 line-through' : 'bg-white border border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    ) : (
                      <Circle className="text-slate-300 shrink-0 mt-0.5" size={20} />
                    )}
                    <span className="text-sm leading-relaxed">{step.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm font-medium text-center">
                ✨ {result.encouragement}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDecomposer;