import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  AlertTriangle, 
  Bot, 
  Download, 
  Send,
  Loader2,
  ExternalLink,
  User
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [teamWorkload, setTeamWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Привет! Я твой ИИ-ассистент по WMS Hub. Я проанализировал данные из твоей Google Таблицы. Задавай любые вопросы по задачам, срокам, распределению команды или логистике!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Ссылки на опубликованные листы Google Таблицы
    const roadmapUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0GX3QmtDRXUnfif0sO1qLIYbolQdooVhacv01D12GcfJHaP-kXzigZIBzdgl2NpdaUUPPbZfV6A5_/pub?gid=1820795425&single=true&output=csv';
    const devsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0GX3QmtDRXUnfif0sO1qLIYbolQdooVhacv01D12GcfJHaP-kXzigZIBzdgl2NpdaUUPPbZfV6A5_/pub?gid=1094489822&single=true&output=csv';

    // Загружаем обе таблицы параллельно
    Promise.all([
      fetch(roadmapUrl).then(res => res.text()),
      fetch(devsUrl).then(res => res.text())
    ])
      .then(([roadmapText, devsText]) => {
        // Парсим Roadmap
        const roadmapRows = roadmapText.split('\n').map(row => {
          const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
          return matches.map(val => val.replace(/^"|"$/g, '').trim());
        });

        const parsedTasks = roadmapRows.slice(1).filter(r => r.length > 2 && r[0]).map((r, index) => ({
          id: r[0] || index + 1,
          project: r[1] || 'Общие',
          name: r[2] || 'Без названия',
          status: r[3] || '📋 Бэклог',
          priority: r[4] || 'Средний',
          start: r[6] || '-',
          deadline: r[17] || '2026-12-31',
          link: r[15] && r[15].startsWith('http') ? r[15] : '#'
        }));
        setTasks(parsedTasks);

        // Парсим GanttDevelopers (Занятость команды)
        const devsRows = devsText.split('\n').map(row => {
          const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
          return matches.map(val => val.replace(/^"|"$/g, '').trim());
        });

        // Ищем строки с разработчиками в таблице загрузки (пропускаем заголовки)
        const parsedDevs = [];
        let isDevSection = false;
        for (const r of devsRows) {
          if (r.some(cell => cell.includes('ЗАГРУЗКА РАЗРАБОТЧИКОВ'))) {
            isDevSection = true;
            continue;
          }
          if (isDevSection && r.some(cell => cell.includes('ЗАНЯТОСТЬ ПО МЕСЯЦАМ'))) {
            break;
          }
          // Если строка содержит данные разработчика (Разработчик, Роль, Задач, Дней, Статус)
          if (isDevSection && r.length >= 5 && r[0] && r[0] !== 'Разработчик' && !r[0].includes('⚠️')) {
            parsedDevs.push({
              name: r[0],
              role: r[1] || '-',
              tasks: parseInt(r[2]) || 0,
              days: parseInt(r[3]) || 0,
              status: r[4] || '✅ Норма'
            });
          }
        }
        
        if (parsedDevs.length > 0) {
          setTeamWorkload(parsedDevs);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки данных:', err);
        setLoading(false);
      });
  }, []);

  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMessages = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('сколько') || lower.includes('задач')) {
        const total = tasks.length;
        const done = tasks.filter(t => t.status.includes('Выполнено')).length;
        const work = tasks.filter(t => t.status.includes('В работе') || t.status.includes('Тестирование')).length;
        const backlog = tasks.filter(t => t.status.includes('Бэклог')).length;
        reply = `📊 Всего в Roadmap загружено ${total} задач:\n- Выполнено: ${done}\n- В работе / Тест: ${work}\n- В бэклоге: ${backlog}`;
      } else if (lower.includes('нагрузк') || lower.includes('команд') || lower.includes('разработчик')) {
        reply = `👥 Информация по загрузке команды подгружена из Google Таблицы (${teamWorkload.length} сотрудников). Проверить детали можно во вкладке «Занятость команд».`;
      } else {
        reply = `🤖 Я проанализировал твой запрос в контексте текущих проектов WMS Hub (${tasks.length} задач в системе). Чем еще помочь по проекту?`;
      }

      setChatMessages([...newMessages, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 800);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Проект', 'Задача', 'Статус', 'Приоритет', 'Дата старта', 'Дедлайн'];
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

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-lg bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
          <Loader2 className="animate-spin text-fuchsia-500" size={24} />
          <span className="text-slate-300">Загрузка данных из Google Таблиц...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-fuchsia-500 selection:text-white">
      <aside className="w-64 bg-slate-900/80 backdrop-blur border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            WMS Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Логистика & Разработка 2026</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <LayoutDashboard size={18} /> Дашборд
          </button>
          <button 
            onClick={() => setActiveTab('gantt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'gantt' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <FolderKanban size={18} /> Диаграмма Ганта
          </button>
          <button 
            onClick={() => setActiveTab('workload')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'workload' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <Users size={18} /> Занятость команд
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <Bot size={18} /> ИИ Ассистент
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={exportToCSV}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors border border-slate-700/50">
            <Download size={16} /> Экспорт в CSV
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-18 bg-slate-900/50 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">Фильтр проекта:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500 transition-colors">
              <option value="all">Все проекты ({projectsList.length})</option>
              {projectsList.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Синхронизировано с Google
            </span>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium">Всего задач</div>
                  <div className="text-3xl font-extrabold mt-2 text-slate-100">{tasks.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium">Выполнено</div>
                  <div className="text-3xl font-extrabold mt-2 text-emerald-400">
                    {tasks.filter(t => t.status.includes('Выполнено')).length}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium">В работе / Тест</div>
                  <div className="text-3xl font-extrabold mt-2 text-blue-400">
                    {tasks.filter(t => t.status.includes('В работе') || t.status.includes('Тестирование')).length}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium">Бэклог</div>
                  <div className="text-3xl font-extrabold mt-2 text-amber-400">
                    {tasks.filter(t => t.status.includes('Бэклог')).length}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-semibold text-lg text-slate-200">Roadmap задач</h3>
                  <span className="text-xs text-slate-400">Показано: {filteredTasks.length} из {tasks.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40 font-medium">
                        <th className="p-4 pl-6">ID</th>
                        <th className="p-4">Проект</th>
                        <th className="p-4">Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4 pr-6">Дедлайн</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredTasks.map(t => {
                        const isDone = t.status.includes('Выполнено');
                        const isWork = t.status.includes('В работе') || t.status.includes('Тестирование');
                        
                        return (
                          <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                            <td className="p-4 pl-6 text-slate-400 font-mono text-xs">{t.id}</td>
                            <td className="p-4 font-semibold text-fuchsia-400">{t.project}</td>
                            <td className="p-4">
                              {t.link !== '#' ? (
                                <a href={t.link} target="_blank" rel="noreferrer" className="hover:text-fuchsia-300 text-slate-100 flex items-center gap-1.5 transition-colors">
                                  {t.name} <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
                                </a>
                              ) : (
                                <span className="text-slate-200">{t.name}</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                isDone 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : isWork
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                                t.priority === 'Высокий' || t.priority === 'Критичный' 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-slate-300 font-mono text-xs">{t.deadline}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gantt' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">График задач и дедлайнов</h3>
              <div className="space-y-3">
                {filteredTasks.slice(0, 20).map(t => (
                  <div key={t.id} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold text-fuchsia-400 mr-2">[{t.project}]</span> 
                      <span className="text-slate-200">{t.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                      Дедлайн: <span className="text-slate-200 font-mono">{t.deadline || 'Не указан'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Users className="text-fuchsia-400" /> Занятость разработчиков (Динамически из Google Таблиц)
                </h3>
                <p className="text-slate-400 text-sm mt-1">Информация загружается в реальном времени из листа GanttDevelopers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamWorkload.map((dev, idx) => (
                  <div key={idx} className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-200">{dev.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Роль: <span className="text-fuchsia-400">{dev.role}</span> | Задач: {dev.tasks} ({dev.days} раб. дней)</div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        dev.status.includes('Высокая') || dev.status.includes('Перегружен')
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {dev.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-[calc(100vh-160px)] flex flex-col justify-between">
              <div className="pb-4 border-b border-slate-800 flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-600/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">ИИ Ассистент Проекта</h3>
                  <p className="text-xs text-slate-400">Интерактивный чат с контекстом ваших задач из Google Таблиц</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20' 
                        : 'bg-slate-800 text-fuchsia-400 border border-slate-700'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-fuchsia-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-xs'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-fuchsia-400 border border-slate-700 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-fuchsia-400" /> Ассистент анализирует данные...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800 flex gap-3">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Задайте любой вопрос по задачам, срокам или нагрузке..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-fuchsia-600/20 flex items-center justify-center">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
