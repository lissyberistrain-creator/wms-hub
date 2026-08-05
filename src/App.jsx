import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Bot, 
  Plus, 
  Trash2, 
  Edit3, 
  Send, 
  Loader2, 
  BarChart2, 
  RefreshCw,
  User
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('all');

  const roleDevelopers = {
    'Analyst': ['Фроленков Денис', 'Гузенко Антон'],
    'DB': ['Голик Егор', 'Тарасов Алексей', 'Цветкова Арина'],
    'Backend': ['Брянцев Александр'],
    'Frontend': ['Сергей'],
    'OLAP': ['Довгань Алексей'],
    'Mobile': ['Сухоруков Роман', 'Вавулин Елисей'],
    'Testing': ['Склад', 'QA Отдел']
  };

  const initial50Tasks = [
    {
      "id": 1,
      "project": "WMS MOBILE",
      "name": "Снятие Рефакторинг",
      "status": "Тестирование",
      "priority": "Высокий",
      "dependsOn": null,
      "roles": [
        { "role": "Mobile", "dev": "Сухоруков Роман", "estimateDays": 10, "planStart": "2026-04-01", "planEnd": "2026-05-05", "factEnd": "" },
        { "role": "Testing", "dev": "Склад", "estimateDays": 10, "planStart": "2026-08-05", "planEnd": "2026-08-10", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-08-10"
    },
    {
      "id": 2,
      "project": "Поиск",
      "name": "Модуль поиска списанных вещей",
      "status": "В работе",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "DB", "dev": "Голик Егор", "estimateDays": 10, "planStart": "2026-07-31", "planEnd": "2026-08-03", "factEnd": "" },
        { "role": "Backend", "dev": "Брянцев Александр", "estimateDays": 5, "planStart": "2026-08-03", "planEnd": "2026-08-04", "factEnd": "" },
        { "role": "Mobile", "dev": "Вавулин Елисей", "estimateDays": 4, "planStart": "2026-08-04", "planEnd": "2026-08-10", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-08-10"
    },
    {
      "id": 3,
      "project": "Инвентаризация",
      "name": "Сервис для валидации ШК",
      "status": "В работе",
      "priority": "Высокий",
      "dependsOn": null,
      "roles": [
        { "role": "Backend", "dev": "Брянцев Александр", "estimateDays": 5, "planStart": "2026-07-31", "planEnd": "2026-08-05", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-12-31"
    },
    {
      "id": 4,
      "project": "Отчетность",
      "name": "Переработка отчёта \"Общие показатели инвентаризации\"",
      "status": "В работе",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "OLAP", "dev": "Довгань Алексей", "estimateDays": 14, "planStart": "2026-05-08", "planEnd": "2026-05-11", "factEnd": "" },
        { "role": "Frontend", "dev": "Сергей", "estimateDays": 10, "planStart": "2026-08-11", "planEnd": "2026-08-25", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-08-25"
    },
    {
      "id": 5,
      "project": "Инвентаризация",
      "name": "Точечная инвентаризация по УИН",
      "status": "Бэклог",
      "priority": "Высокий",
      "dependsOn": null,
      "roles": [
        { "role": "DB", "dev": "Цветкова Арина", "estimateDays": 2, "planStart": "2026-07-31", "planEnd": "2026-08-04", "factEnd": "" },
        { "role": "Backend", "dev": "Брянцев Александр", "estimateDays": 2, "planStart": "2026-08-05", "planEnd": "2026-08-07", "factEnd": "" },
        { "role": "Mobile", "dev": "Сухоруков Роман", "estimateDays": 5, "planStart": "2026-08-07", "planEnd": "2026-08-14", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-08-14"
    },
    {
      "id": 6,
      "project": "Инвентаризация",
      "name": "Изменение условий отбора улиц для инвентаризации для низкооборачиваемых зон",
      "status": "Бэклог",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "OLAP", "dev": "Гузенко Антон", "estimateDays": 5, "planStart": "2026-08-01", "planEnd": "2026-08-10", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-12-31"
    },
    {
      "id": 7,
      "project": "Инвентаризация",
      "name": "Покрытие авто заданиями площадок сейф/супер сейф/питание",
      "status": "Бэклог",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "OLAP", "dev": "Гузенко Антон", "estimateDays": 5, "planStart": "2026-08-01", "planEnd": "2026-08-10", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-12-31"
    },
    {
      "id": 8,
      "project": "Саппорт",
      "name": "Проливка заданий на Инвент КИЗ через wh support",
      "status": "Бэклог",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "Backend", "dev": "Брянцев Александр", "estimateDays": 3, "planStart": "", "planEnd": "", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-12-31"
    },
    {
      "id": 9,
      "project": "Поиск",
      "name": "Верификация МХ при пропуске товара в модулях «Поиск вещей» и «Инвент КИЗ»",
      "status": "Бэклог",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "Backend", "dev": "Брянцев Александр", "estimateDays": 4, "planStart": "", "planEnd": "", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-12-31"
    },
    {
      "id": 10,
      "project": "Инвентаризация",
      "name": "Изменение в передачи данных при выгрузке",
      "status": "Бэклог",
      "priority": "Средний",
      "dependsOn": null,
      "roles": [
        { "role": "Backend", "dev": "Брянцев Александр", "estimateDays": 3, "planStart": "", "planEnd": "", "factEnd": "" }
      ],
      "externalLoad": [],
      "resultsHistory": [],
      "deadline": "2026-12-31"
    },
    {
      "id": 27,
      "project": "Снятие",
      "name": "Отключение оплаты за снятие стикерованного товара с паллет",
      "status": "Выполнено",
      "priority": "Высокий",
      "dependsOn": null,
      "roles": [
        { "role": "DB", "dev": "Голик Егор", "estimateDays": 3, "planStart": "2026-05-22", "planEnd": "2026-05-25", "factEnd": "2026-05-25" }
      ],
      "externalLoad": [],
      "resultsHistory": ["Релиз успешен"],
      "deadline": "2026-06-01"
    }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_full_50_tasks_v6');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return initial50Tasks;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    project: 'WMS MOBILE',
    name: '',
    status: 'Бэклог',
    priority: 'Средний',
    dependsOn: '',
    roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '', planEnd: '', factEnd: '' }],
    resultsHistoryInput: ''
  });

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Привет! Я ассистент WMS Hub. Задайте любой вопрос по проекту!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('wms_hub_full_50_tasks_v6', JSON.stringify(tasks));
  }, [tasks]);

  const handleResetToExcel = () => {
    setTasks(initial50Tasks);
    localStorage.setItem('wms_hub_full_50_tasks_v6', JSON.stringify(initial50Tasks));
  };

  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, ...formData } : t));
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        resultsHistory: formData.resultsHistoryInput ? [formData.resultsHistoryInput] : []
      };
      setTasks([newTask, ...tasks]);
    }

    setFormData({
      project: 'WMS MOBILE',
      name: '',
      status: 'Бэклог',
      priority: 'Средний',
      dependsOn: '',
      roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '', planEnd: '', factEnd: '' }],
      resultsHistoryInput: ''
    });
    setIsModalOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setFormData({
      project: task.project,
      name: task.name,
      status: task.status,
      priority: task.priority,
      dependsOn: task.dependsOn || '',
      roles: task.roles || [],
      resultsHistoryInput: ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddRoleRow = () => {
    setFormData({
      ...formData,
      roles: [...formData.roles, { role: 'DB', dev: 'Голик Егор', estimateDays: 3, planStart: '', planEnd: '', factEnd: '' }]
    });
  };

  const handleRemoveRoleRow = (index) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== index)
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage || !inputMessage.trim()) return;

    const userText = inputMessage;
    const newMessages = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('отчет') || lower.includes('месяц') || lower.includes('итоги')) {
        const completed = tasks.filter(t => t.status === 'Выполнено');
        const inProgress = tasks.filter(t => t.status === 'В работе' || t.status === 'Тестирование');
        reply = `📋 **Отчет WMS Hub:**\n- Всего задач: ${tasks.length}\n- Выполнено: ${completed.length}\n- В работе / Тест: ${inProgress.length}`;
      } else {
        reply = `🤖 Я проанализировал ваши ${tasks.length} задач. Чем еще могу помочь?`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 500);
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  // Формирование аналитики по разработчикам
  const allDevsList = [];
  Object.entries(roleDevelopers).forEach(([roleName, devsArray]) => {
    devsArray.forEach(d => {
      allDevsList.push({ name: d, role: roleName });
    });
  });

  const devStats = {};
  allDevsList.forEach(item => {
    devStats[item.name] = { tasksCount: 0, role: item.role };
  });

  tasks.forEach(t => {
    if (Array.isArray(t.roles)) {
      t.roles.forEach(r => {
        if (r && r.dev && devStats[r.dev]) {
          devStats[r.dev].tasksCount += 1;
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-fuchsia-500 selection:text-white">
      <aside className="w-64 bg-slate-900/85 backdrop-blur border-r border-slate-800 flex flex-col h-screen overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-800 shrink-0">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            WMS Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise Edition 2026</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <LayoutDashboard size={18} /> Реестр & План/Факт
          </button>
          <button 
            onClick={() => setActiveTab('gantt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'gantt' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <FolderKanban size={18} /> Диаграмма Ганта
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <BarChart2 size={18} /> Аналитика & Команда
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <Bot size={18} /> Умный ИИ Ассистент
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-fuchsia-600/20">
            <Plus size={16} /> Создать задачу
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-18 bg-slate-900/50 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">Проект:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500">
              <option value="all">Все проекты ({projectsList.length})</option>
              {projectsList.map((p, idx) => (<option key={idx} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleResetToExcel}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all">
              <RefreshCw size={12} /> Сбросить данные
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Всего задач: {tasks.length}
            </span>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs">Всего</div>
                  <div className="text-2xl font-bold mt-1">{tasks.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs">В работе</div>
                  <div className="text-2xl font-bold mt-1 text-blue-400">{tasks.filter(t => t.status === 'В работе' || t.status === 'Тестирование').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs">Бэклог</div>
                  <div className="text-2xl font-bold mt-1 text-amber-400">{tasks.filter(t => t.status === 'Бэклог').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs">Удержание</div>
                  <div className="text-2xl font-bold mt-1 text-purple-400">{tasks.filter(t => t.status === 'Удержание').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs">Отмена</div>
                  <div className="text-2xl font-bold mt-1 text-rose-400">{tasks.filter(t => t.status === 'Отмена').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs">Выполнено</div>
                  <div className="text-2xl font-bold mt-1 text-emerald-400">{tasks.filter(t => t.status === 'Выполнено').length}</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-semibold text-lg text-slate-200">Реестр задач</h3>
                  <span className="text-xs text-slate-400">Показано: {filteredTasks.length} из {tasks.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40 text-xs font-medium">
                        <th className="p-4 pl-6">ID / Проект / Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4">Роли, Сотрудники, План & Факт</th>
                        <th className="p-4 pr-6 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredTasks.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-500">#{t.id}</span>
                              <span className="text-xs font-semibold text-fuchsia-400">{t.project}</span>
                            </div>
                            <div className="text-slate-100 font-medium mt-1 w-56">{t.name}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              t.status === 'Выполнено' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              t.status === 'Удержание' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              t.status === 'Отмена' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              t.status === 'Тестирование' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              t.status === 'В работе' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>{t.status}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                              t.priority === 'Высокий' || t.priority === 'Критичный' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-300'
                            }`}>{t.priority}</span>
                          </td>
                          <td className="p-4 min-w-[340px]">
                            <div className="space-y-1.5 text-xs">
                              {Array.isArray(t.roles) && t.roles.map((r, idx) => (
                                <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                                  <div className="flex justify-between">
                                    <div><span className="text-fuchsia-400 font-semibold">{r.role}:</span> <span className="text-slate-200">{r.dev}</span></div>
                                    <span className="text-slate-400">Оценка: <strong className="text-slate-200">{r.estimateDays} дн.</strong></span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-900">
                                    <span>План: {r.planStart || '—'} → {r.planEnd || '—'}</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-fuchsia-300">Факт финиша:</span>
                                      <input 
                                        type="date" 
                                        value={r.factEnd || ''} 
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setTasks(tasks.map(item => item.id === t.id ? { 
                                            ...item, 
                                            roles: item.roles.map((rol, i) => i === idx ? { ...rol, factEnd: val } : rol) 
                                          } : item));
                                        }} 
                                        className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-fuchsia-500" 
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={() => handleEditTask(t)} className="text-slate-400 hover:text-fuchsia-400 transition-colors p-1" title="Редактировать"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteTask(t.id)} className="text-slate-500 hover:text-rose-400 transition-colors p-1" title="Удалить"><Trash2 size={16} /></button>
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-semibold text-slate-200">Диаграмма Ганта</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-fuchsia-500"></span> В работе / План</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Выполнено</span>
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="min-w-[900px] space-y-4">
                  <div className="grid grid-cols-12 gap-2 text-xs text-slate-400 font-mono border-b border-slate-800 pb-2 px-4">
                    <div className="col-span-4">Задача / Проект</div>
                    <div className="col-span-8 grid grid-cols-4 text-center">
                      <span>Апрель 2026</span>
                      <span>Май 2026</span>
                      <span>Июнь - Июль</span>
                      <span>Август 2026+</span>
                    </div>
                  </div>

                  {filteredTasks.map(t => {
                    const isDone = t.status === 'Выполнено';
                    return (
                      <div key={t.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                        <div className="col-span-4 pr-2">
                          <div className="text-xs font-semibold text-fuchsia-400">[{t.project}]</div>
                          <div className="text-sm text-slate-100 font-medium truncate" title={t.name}>{t.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Дедлайн: {t.deadline}</div>
                        </div>
                        <div className="col-span-8 relative bg-slate-900/80 h-7 rounded-lg flex items-center px-2 border border-slate-800">
                          <div className={`absolute left-2 right-4 h-4 rounded-md transition-all ${
                            isDone ? 'bg-emerald-500/80 shadow-lg shadow-emerald-500/20' : 'bg-gradient-to-r from-fuchsia-600 to-indigo-500 shadow-lg shadow-fuchsia-600/20'
                          }`}></div>
                          <span className="relative z-10 text-[11px] font-mono text-white pl-2">
                            {t.roles?.[0]?.planStart ? `${t.roles[0].planStart} → ${t.deadline}` : `Дедлайн: ${t.deadline}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-semibold text-slate-200">Аналитика по разработчикам и загрузке команды</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allDevsList.map(item => {
                  const stats = devStats[item.name] || { tasksCount: 0, role: item.role };
                  return (
                    <div key={item.name} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 shadow-md">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-fuchsia-400">{item.name} <span className="text-xs text-slate-400 font-normal">({item.role})</span></span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">Задач в пуле: {stats.tasksCount}</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                        <div>Статус: Активный участник разработки WMS Hub</div>
                        <div>Роль в системе: <span className="text-slate-200 font-medium">{item.role}</span></div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-2">
                          <div className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, stats.tasksCount * 15)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[600px]">
              <div className="pb-4 border-b border-slate-800 flex items-center gap-3 shrink-0">
                <div className="p-2.5 bg-fuchsia-600/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20"><Bot size={22} /></div>
                <div>
                  <h3 className="font-semibold text-slate-200">Умный ИИ Ассистент Проекта</h3>
                  <p className="text-xs text-slate-400">Анализ всех {tasks.length} задач с учетом оценок и дат по ролям</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-fuchsia-400 border border-slate-700'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-fuchsia-600 text-white rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-xs'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-fuchsia-400 border border-slate-700 flex items-center justify-center"><Bot size={16} /></div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-fuchsia-400" /> ИИ думает...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800 flex gap-3 shrink-0">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Задайте любой вопрос по проекту..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500"
                />
                <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-fuchsia-600/20 flex items-center justify-center">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-100">{editingId ? 'Редактировать задачу' : 'Создать новую задачу'}</h3>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Проект</label>
                  <input type="text" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} required className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Статус</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200">
                    <option value="Бэклог">Бэклог</option>
                    <option value="В работе">В работе</option>
                    <option value="Тестирование">Тестирование</option>
                    <option value="Удержание">Удержание</option>
                    <option value="Отмена">Отмена</option>
                    <option value="Выполнено">Выполнено</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Название задачи</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Приоритет</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200">
                    <option value="Низкий">Низкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Высокий">Высокий</option>
                    <option value="Критичный">Критичный</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Зависит от задачи (ID)</label>
                  <input type="number" value={formData.dependsOn} onChange={(e) => setFormData({...formData, dependsOn: e.target.value ? Number(e.target.value) : ''})} placeholder="Например: 1" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-fuchsia-400 font-semibold">Участники, роли и плановые даты/оценки</label>
                  <button type="button" onClick={handleAddRoleRow} className="text-xs bg-fuchsia-600/10 text-fuchsia-400 px-2.5 py-1 rounded-lg border border-fuchsia-500/30 hover:bg-fuchsia-600/20">
                    + Добавить роль / сотрудника
                  </button>
                </div>
                {formData.roles.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <select value={r.role} onChange={(e) => {
                      const role = e.target.value;
                      const dev = roleDevelopers[role]?.[0] || '';
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, role, dev } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200">
                      {Object.keys(roleDevelopers).map(role => (<option key={role} value={role}>{role}</option>))}
                    </select>

                    <select value={r.dev} onChange={(e) => {
                      const dev = e.target.value;
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, dev } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200">
                      {(roleDevelopers[r.role] || []).map(dev => (<option key={dev} value={dev}>{dev}</option>))}
                    </select>

                    <input type="number" placeholder="Дней" value={r.estimateDays} onChange={(e) => {
                      const estimateDays = Number(e.target.value);
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, estimateDays } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200" title="Оценка в днях" />

                    <input type="date" value={r.planStart || ''} onChange={(e) => {
                      const planStart = e.target.value;
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, planStart } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200" title="План старта" />

                    <input type="date" value={r.planEnd || ''} onChange={(e) => {
                      const planEnd = e.target.value;
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, planEnd } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200" title="План финиша" />

                    <button type="button" onClick={() => handleRemoveRoleRow(idx)} className="text-rose-400 hover:text-rose-300 text-xs text-center">Удалить</button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium">Отмена</button>
                <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-fuchsia-600/20">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
