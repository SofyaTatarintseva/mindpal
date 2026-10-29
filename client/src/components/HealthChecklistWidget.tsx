import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, HeartPulse, User, Calendar, ShieldCheck, Stethoscope, Loader2 } from 'lucide-react';
import BodyMap from './BodyMap';
interface HealthItem {
  id: string;
  label: string;
  category: string;
  frequency: string;
  gender: 'all' | 'female' | 'male';
  minAge?: number;
  maxAge?: number;
  source: 'oms' | 'private';
}

const HealthChecklistWidget = () => {
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [age, setAge] = useState<number>(35);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isSetup, setIsSetup] = useState(false);
  const [activeTab, setActiveTab] = useState<'oms' | 'private'>('oms');
  
  // Состояния для данных с сервера
  const [items, setItems] = useState<HealthItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Функция запроса к нашему API
  const fetchChecklist = async (gender: string, age: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/health/checklist?gender=${gender}&age=${age}`);
      if (!response.ok) throw new Error('Ошибка сервера');
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError('Не удалось загрузить рекомендации');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  // При загрузке проверяем, есть ли сохраненный профиль
  useEffect(() => {
    const savedProfile = localStorage.getItem('mindpal_health_profile');
    if (savedProfile) {
      try {
        const { savedGender, savedAge, savedChecked } = JSON.parse(savedProfile);
        setGender(savedGender);
        setAge(savedAge);
        setChecked(savedChecked || {});
        setIsSetup(true);
        // Загружаем данные для сохраненного профиля
        fetchChecklist(savedGender, savedAge);
      } catch (e) {
        console.error('Ошибка загрузки профиля здоровья', e);
      }
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('mindpal_health_profile', JSON.stringify({
      savedGender: gender,
      savedAge: age,
      savedChecked: checked
    }));
    setIsSetup(true);
    fetchChecklist(gender, age); // Запрашиваем список с сервера
  };

  const toggleCheck = (id: string) => {
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);
    localStorage.setItem('mindpal_health_profile', JSON.stringify({
      savedGender: gender,
      savedAge: age,
      savedChecked: newChecked
    }));
  };

  // Фильтрация полученных данных по вкладке
  const getFilteredItems = (source: 'oms' | 'private') => {
    return items.filter(item => item.source === source);
  };

  const omsItems = getFilteredItems('oms');
  const privateItems = getFilteredItems('private');
  const currentItems = activeTab === 'oms' ? omsItems : privateItems;
  const categories = Array.from(new Set(currentItems.map(item => item.category)));
  
  const totalItems = currentItems.length;
  const doneItems = currentItems.filter(item => checked[item.id]).length;
  const progress = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  // Форма настройки
  if (!isSetup) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <HeartPulse size={18} className="text-rose-500" /> Настройка чек-листа
        </h3>
        <p className="text-sm text-slate-500 mb-4">Укажи данные, чтобы получить персональный список.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Пол</label>
            <div className="flex gap-2">
              <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${gender === 'female' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Женский</button>
              <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Мужской</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Возраст</label>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-400" />
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={18} max={100} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 text-sm" />
            </div>
          </div>
          <button onClick={saveProfile} disabled={isLoading} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-all text-sm disabled:bg-slate-300 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="animate-spin" size={16}/> Загрузка...</> : 'Показать чек-лист'}
          </button>
        </div>
      </div>
    );
  }
  const getActiveZones = () => {
    const zones: Record<string, boolean> = {};
    
    // Проходим по всем отмеченным анализам
    Object.keys(checked).forEach(itemId => {
      if (checked[itemId]) {
        // Находим этот анализ в общем списке items, чтобы взять его zone
        const item = items.find(i => i.id === itemId);
        if (item && item.zone) {
          zones[item.zone] = true;
        }
      }
    });

    return zones;
  };
  // Отображение чек-листа
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <HeartPulse size={18} className="text-rose-500" /> Здоровье
        </h3>
        <button onClick={() => setIsSetup(false)} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <User size={12} /> Изменить ({age} лет)
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <BodyMap activeZones={getActiveZones()} /> 
      </div>
      <div className="flex gap-2 mb-4 bg-slate-50 p-1 rounded-xl">
        <button onClick={() => setActiveTab('oms')} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === 'oms' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <ShieldCheck size={14} /> По ОМС
        </button>
        <button onClick={() => setActiveTab('private')} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === 'private' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Stethoscope size={14} /> Расширенный
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>Прогресс</span>
        <span>{doneItems} / {totalItems}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
        <div className={`h-2 rounded-full transition-all duration-500 ${activeTab === 'oms' ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-300" /></div>
        ) : (
          categories.map(category => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
              <div className="space-y-2">
                {currentItems.filter(item => item.category === category).map(item => (
                  <div key={item.id} onClick={() => toggleCheck(item.id)} className="flex items-start gap-2 cursor-pointer group">
                    {checked[item.id] ? (
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${activeTab === 'oms' ? 'text-emerald-500' : 'text-blue-500'}`} />
                    ) : (
                      <Circle size={16} className="text-slate-300 shrink-0 mt-0.5 group-hover:text-slate-400" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${checked[item.id] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthChecklistWidget;