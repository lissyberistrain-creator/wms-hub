import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Bot, 
  Download, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rawImportText, setRawImportText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('Нажмите кнопку анализа, чтобы ИИ проверил загруженные задачи на узкие места и перегрузки разработчиков.');

  // Загрузка данных из Google Таблицы при старте
  useEffect(() => {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0GX3QmtDRXUnfif0sO1qLIYbolQdooVhacv01D12GcfJHaP-kXzigZIBzdgl2NpdaUUPPbZfV6A5_/pub?gid=1820795425&single=true&output=csv';

    fetch(csvUrl)
      .then(response => response.text())
      .then(csvText => {
        const rows = csvText.split('\n').map(row => {
          // Простой парсер CSV с учетом возможных кавычек
          const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
          return matches.map(val => val.replace(/^"|"$/g, '').trim());
        });

        // Пропускаем шапку (первую строку) и мапим под нашу структуру
        const parsedTasks = rows.slice(1).filter(r => r.length > 2 && r[0]).map((r, index) => ({
          id: r[0] || index + 1,
          project: r[1] || 'Общие',
          name: r[2] || 'Без названия',
          status: r[3] || 'Бэклог',
          priority: r[4] || 'Средний',
          start: r[6] || '2026-01-01',
          deadline: r[17] || '2026-12-31',
          progress: r[3] === '✅ Выполнено' ? 100 : (r[3] === '⚙️ В работе' ? 50 : 10),
          link: r[8] && r[8].startsWith('http') ? r[8] : '#'
        }));

        setTasks(parsedTasks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки таблицы:', err);
        setLoading(false);
      });
  }, []);

  // Список уникальных проектов для выпадающего списка
  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  // Функция экспорта в CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Проект', 'Задача', 'Статус', 'Приоритет', 'Начало', 'Дедлайн'];
    const rows = tasks.map(t => [t.id, t.project, t.name, t.status, t.priority, t.start, t.deadline]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'wms_roadmap_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Имитация ИИ-анализа узких мест
  const runAiAnalysis = () => {
    setAiAnalysis('🔍 Анализ таблицы завершен:\n1. Загружено актуальных задач из Google Sheets: ' + tasks.length + '.\n2. Обнаружена высокая концентрация задач в статусе бэклога.\n3. Рекомендуется пересмотреть приоритеты критичных задач для избежания просрочек.');
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg">
          <Loader2 className="animate-spin text-blue-500" size={24} />
          Загрузка актуальных данных из Google Таблицы...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Боковое меню */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            WMS Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Синхронизировано с Google Sheets</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <LayoutDashboard size={18} /> Дашборд
          </button>
          <button 
            onClick={() => setActiveTab('gantt')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gantt' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <FolderKanban size={18} /> Диаграмма Ганта
          </button>
          <button 
            onClick={() => setActiveTab('bottlenecks')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bottlenecks' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <AlertTriangle size={18} /> Узкие места & Риски
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <Bot size={18} /> ИИ Ассистент
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={exportToCSV}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} /> Экспорт в CSV
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-slate-800 border-b border-slate-700 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">Проект:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="all">Все проекты ({projectsList.length})</option>
              {projectsList.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live из Google Таблицы
            </span>
          </div>
        </header>

        <div className="p-8 flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">Всего задач</div>
                  <div className="text-3xl font-bold mt-2">{tasks.length}</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">Выполнено</div>
                  <div className="text-3xl font-bold mt-2 text-emerald-400">
                    {tasks.filter(t => t.status.includes('Выполнено')).length}
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">В работе</div>
                  <div className="text-3xl font-bold mt-2 text-blue-400">
                    {tasks.filter(t => t.status.includes('В работе')).length}
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">Высокий приоритет</div>
                  <div className="text-3xl font-bold mt-2 text-amber-400">
                    {tasks.filter(t => t.priority === 'Высокий' || t.priority === 'Критичный').length}
                  </div>
                </div>
              </div>

              {/* Таблица задач */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Roadmap задач из Google Таблицы</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 bg-slate-800/50">
                        <th className="p-4">ID</th>
                        <th className="p-4">Проект</th>
                        <th className="p-4">Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4">Дедлайн</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredTasks.map(t => (
                        <tr key={t.id} className="hover:bg-slate-700/50 transition-colors">
                          <td className="p-4 text-slate-400 font-mono text-xs">{t.id}</td>
                          <td className="p-4 font-medium text-blue-400">{t.project}</td>
                          <td className="p-4">
                            {t.link !== '#' ? (
                              <a href={t.link} target="_blank" rel="noreferrer" className="hover:underline text-slate-100 flex items-center gap-1">
                                {t.name} 🔗
                              </a>
                            ) : (
                              <span>{t.name}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.priority === 'Высокий' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300">{t.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gantt' && (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">График задач и дедлайнов</h3>
                <div className="space-y-3">
                  {filteredTasks.slice(0, 15).map(t => (
                    <div key={t.id} className="p-3 bg-slate-700/30 rounded-lg flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium text-blue-400">[{t.project}]</span> <span className="text-slate-200">{t.name}</span>
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-700 px-2.5 py-1 rounded">
                        Дедлайн: {t.deadline || 'Не указан'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bottlenecks' && (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" /> Анализ рисков по данным таблицы
                </h3>
                <p className="text-slate-400 text-sm mb-6">Синхронизировано в реальном времени из Google Таблиц.</p>
                <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <AlertCircle size={18} /> Активные задачи в бэклоге
                  </div>
                  <p className="text-sm text-slate-300">
                    В бэклоге находится большое количество задач ({tasks.filter(t => t.status.includes('Бэклог')).length} шт.). Проверьте распределение приоритетов.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="text-blue-400" /> ИИ Ассистент Проекта
                </h3>
                <p className="text-slate-400 text-sm">Запустите анализ текущего состояния задач из таблицы:</p>
                
                <button 
                  onClick={runAiAnalysis}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
                  Запустить ИИ Анализ таблицы
                </button>

                <div className="mt-6 p-4 bg-slate-900 border border-slate-700 rounded-xl whitespace-pre-line text-sm text-slate-300">
                  {aiAnalysis}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
