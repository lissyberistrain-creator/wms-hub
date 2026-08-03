import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Bot, 
  Download, 
  Upload, 
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('all');
  
  // Исходные данные на основе вашей выгрузки WMS
  const [projects, setProjects] = useState([
    { id: 1, name: 'WMS MOBILE', code: 'WMS', description: 'Рефакторинг и мобильные задачи' },
    { id: 2, name: 'Поиск', code: 'ICAD', description: 'Модуль поиска списанных вещей' },
    { id: 3, name: 'Инвентаризация', code: 'INV', description: 'Сервис валидации ШК и точечная инвентаризация' },
    { id: 4, name: 'Отчетность', code: 'REP', description: 'Переработка отчета "Общие показатели"' }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      project: 'WMS MOBILE',
      name: 'Снятие Рефакторинг',
      status: 'Тестирование',
      priority: 'Высокий',
      assignees: 'Сухоруков Роман (70%)',
      department: 'Склад',
      start: '2026-04-01',
      deadline: '2026-08-10',
      progress: 80,
      metrics: 1.04,
      link: 'https://tracker.wb.ru/n/LAYOUT/p/INV/b/BOARD-3234/'
    },
    {
      id: 2,
      project: 'Поиск',
      name: 'Модуль поиска списанных вещей',
      status: 'В работе',
      priority: 'Средний',
      assignees: 'Голик Егор, Брянцев Александр, Вавулин Елисей',
      department: 'DB / Backend / Mobile',
      start: '2026-07-31',
      deadline: '2026-08-10',
      progress: 60,
      metrics: 1.05,
      link: 'https://youtrack.wildberries.ru/issue/ICAD-10552'
    },
    {
      id: 3,
      project: 'Инвентаризация',
      name: 'Сервис для валидации ШК',
      status: 'В работе',
      priority: 'Высокий',
      assignees: 'Цветкова Арина, Брянцев Александр',
      department: 'DB / Backend',
      start: '2026-07-31',
      deadline: '2026-08-14',
      progress: 67,
      metrics: 1.10,
      link: '#'
    },
    {
      id: 4,
      project: 'Отчетность',
      name: 'Переработка отчета "Общие показатели инвентаризации"',
      status: 'В работе',
      priority: 'Средний',
      assignees: 'Довгань Алексей, Сергей',
      department: 'OLAP / Frontend',
      start: '2026-05-08',
      deadline: '2026-08-25',
      progress: 60,
      metrics: 1.00,
      link: 'https://tracker.wb.ru/n/LAYOUT/p/INV/b/BOARD-3234/'
    }
  ]);

  const [rawImportText, setRawImportText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('Нажмите кнопку анализа, чтобы ИИ проверил загруженные задачи на узкие места и перегрузки разработчиков.');

  // Функция экспорта в CSV
  const exportToCSV = () => {
    const headers = ['Проект', 'Задача', 'Статус', 'Приоритет', 'Исполнители', 'Начало', 'Дедлайн', 'Прогресс %'];
    const rows = tasks.map(t => [t.project, t.name, t.status, t.priority, t.assignees, t.start, t.deadline, t.progress]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'projects_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Имитация ИИ-анализа узких мест
  const runAiAnalysis = () => {
    setAiAnalysis('🔍 Анализ завершен:\n1. Обнаружена высокая концентрация задач у разработчика Брянцев Александр (пересечение дедлайнов 07.08.2026).\n2. Задача по WMS Mobile выходит на финальную стадию тестирования, рисков срыва нет.\n3. Рекомендуется перераспределить задачи бэкенда для снижения риска просрочки по модулю поиска.');
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Боковое меню */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            WMS Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Управление логистикой и ИИ</p>
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
            onClick={() => setActiveTab('workload')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'workload' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <Users size={18} /> Занятость команд
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
        {/* Шапка */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">Проект:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="all">Все проекты (Портфель)</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Система активна
            </span>
          </div>
        </header>

        {/* Контент вкладок */}
        <div className="p-8 flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">Всего задач</div>
                  <div className="text-3xl font-bold mt-2">{tasks.length}</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">В работе / Тестирование</div>
                  <div className="text-3xl font-bold mt-2 text-blue-400">
                    {tasks.filter(t => t.status !== 'Бэклог').length}
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">Высокий приоритет</div>
                  <div className="text-3xl font-bold mt-2 text-amber-400">
                    {tasks.filter(t => t.priority === 'Высокий').length}
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="text-slate-400 text-sm">Средняя метрика вклада</div>
                  <div className="text-3xl font-bold mt-2 text-emerald-400">1.04</div>
                </div>
              </div>

              {/* Таблица задач */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Список задач и метрик</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 bg-slate-800/50">
                        <th className="p-4">Проект</th>
                        <th className="p-4">Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4">Исполнители</th>
                        <th className="p-4">Дедлайн</th>
                        <th className="p-4">Прогресс</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredTasks.map(t => (
                        <tr key={t.id} className="hover:bg-slate-700/50 transition-colors">
                          <td className="p-4 font-medium text-blue-400">{t.project}</td>
                          <td className="p-4">
                            <a href={t.link} target="_blank" rel="noreferrer" className="hover:underline text-slate-100">
                              {t.name}
                            </a>
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
                          <td className="p-4 text-slate-300">{t.assignees}</td>
                          <td className="p-4 text-slate-300">{t.deadline}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{ width: `${t.progress}%` }}></div>
                              </div>
                              <span className="text-xs text-slate-400">{t.progress}%</span>
                            </div>
                          </td>
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
                <h3 className="text-lg font-semibold mb-4">Визуальная шкала времени (Диаграмма Ганта)</h3>
                <div className="space-y-4">
                  {filteredTasks.map(t => (
                    <div key={t.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t.project}: {t.name}</span>
                        <span className="text-slate-400">{t.start} — {t.deadline}</span>
                      </div>
                      <div className="w-full bg-slate-700 h-6 rounded-lg relative overflow-hidden flex items-center px-3">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-blue-600/60 rounded-lg flex items-center px-3 text-xs font-medium text-white"
                          style={{ width: `${t.progress + 20}%` }}>
                          {t.progress}% выполнено
                        </div>
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
                  <AlertTriangle className="text-amber-400" /> Анализ узких мест и рисков проекта
                </h3>
                <p className="text-slate-400 text-sm mb-6">Автоматическое выявление пересечений ресурсов и критических путей.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold">
                      <AlertCircle size={18} /> Перегрузка разработчиков
                    </div>
                    <p className="text-sm text-slate-300">
                      <strong>Брянцев Александр</strong> задействован одновременно в задачах по Поиску и Инвентаризации с пересечением дедлайнов в начале августа 2026.
                    </p>
                  </div>
                  <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <CheckCircle2 size={18} /> Статус WMS Mobile
                    </div>
                    <p className="text-sm text-slate-300">
                      Проект находится на этапе тестирования у Сухорукова Романа. Узких мест по инфраструктуре не зафиксировано.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold">Распределение занятости команды</h3>
              <div className="space-y-3">
                <div className="bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-medium">Сухоруков Роман</div>
                    <div className="text-xs text-slate-400">Mobile Developer</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-400">WMS Mobile (70% времени)</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-medium">Брянцев Александр</div>
                    <div className="text-xs text-slate-400">Backend Developer</div>
                  </div>
                  <div className="text-sm font-semibold text-amber-400">Поиск + Инвентаризация (Перегрузка)</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-medium">Довгань Алексей</div>
                    <div className="text-xs text-slate-400">OLAP Analyst</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">Отчетность (50% времени)</div>
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
                <p className="text-slate-400 text-sm">Вставьте текст или сырые данные для быстрого анализа:</p>
                
                <textarea 
                  rows={4}
                  value={rawImportText}
                  onChange={(e) => setRawImportText(e.target.value)}
                  placeholder="Вставьте сюда список задач или требования..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />

                <button 
                  onClick={runAiAnalysis}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
                  Запустить ИИ Анализ
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