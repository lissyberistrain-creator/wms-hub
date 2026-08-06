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
  User,
  Kanban
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');
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

  // Все 50 задач с поддержкой среза результатов и метрик разработки
  const initial50Tasks = [
    {
      id: 1,
      project: "WMS MOBILE",
      name: "Снятие Рефакторинг",
      status: "Тестирование",
      priority: "Высокий",
      dependsOn: null,
      roles: [
        { role: "Mobile", dev: "Сухоруков Роман", estimateDays: 10, planStart: "2026-04-01", planEnd: "2026-05-05", factEnd: "" },
        { role: "Testing", dev: "Склад", estimateDays: 10, planStart: "2026-08-05", planEnd: "2026-08-10", factEnd: "" }
      ],
      resultsHistory: ["Успешный прогон автотестов рефакторинга"],
      deadline: "2026-08-10"
    },
    {
      id: 2,
      project: "Поиск",
      name: "Модуль поиска списанных вещей",
      status: "В работе",
      priority: "Средний",
      dependsOn: null,
      roles: [
        { role: "DB", dev: "Голик Егор", estimateDays: 10, planStart: "2026-07-31", planEnd: "2026-08-03", factEnd: "" },
        { role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-08-03", planEnd: "2026-08-04", factEnd: "" },
        { role: "Mobile", dev: "Вавулин Елисей", estimateDays: 4, planStart: "2026-08-04", planEnd: "2026-08-10", factEnd: "" }
      ],
      resultsHistory: [],
      deadline: "2026-08-10"
    },
    {
      id: 3,
      project: "Инвентаризация",
      name: "Сервис для валидации ШК",
      status: "В работе",
      priority: "Высокий",
      dependsOn: null,
      roles: [
        { role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-07-31", planEnd: "2026-08-05", factEnd: "" }
      ],
      resultsHistory: [],
      deadline: "2026-12-31"
    },
    {
      id: 4,
      project: "Отчетность",
      name: "Переработка отчёта \"Общие показатели инвентаризации\"",
      status: "В работе",
      priority: "Средний",
      dependsOn: null,
      roles: [
        { role: "OLAP", dev: "Довгань Алексей", estimateDays: 14, planStart: "2026-05-08", planEnd: "2026-05-11", factEnd: "" },
        { role: "Frontend", dev: "Сергей", estimateDays: 10, planStart: "2026-08-11", planEnd: "2026-08-25", factEnd: "" }
      ],
      resultsHistory: [],
      deadline: "2026-08-25"
    },
    {
      id: 5,
      project: "Инвентаризация",
      name: "Точечная инвентаризация по УИН",
      status: "Бэклог",
      priority: "Высокий",
      dependsOn: null,
      roles: [
        { role: "DB", dev: "Цветкова Арина", estimateDays: 2, planStart: "2026-07-31", planEnd: "2026-08-04", factEnd: "" },
        { role: "Backend", dev: "Брянцев Александр", estimateDays: 2, planStart: "2026-08-05", planEnd: "2026-08-07", factEnd: "" },
        { role: "Mobile", dev: "Сухоруков Роман", estimateDays: 5, planStart: "2026-08-07", planEnd: "2026-08-14", factEnd: "" }
      ],
      resultsHistory: [],
      deadline: "2026-08-14"
    },
    {
      id: 6,
      project: "Инвентаризация",
      name: "Изменение условий отбора улиц для инвентаризации для низкооборачиваемых зон",
      status: "Бэклог",
      priority: "Средний",
      dependsOn: null,
      roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 5, planStart: "2026-08-01", planEnd: "2026-08-10", factEnd: "" }],
      resultsHistory: [],
      deadline: "2026-12-31"
    },
    {
      id: 7,
      project: "Инвентаризация",
      name: "Покрытие авто заданиями площадок сейф/супер сейф/питание",
      status: "Бэклог",
      priority: "Средний",
      dependsOn: null,
      roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 5, planStart: "2026-08-01", planEnd: "2026-08-10", factEnd: "" }],
      resultsHistory: [],
      deadline: "2026-12-31"
    },
    {
      id: 8,
      project: "Саппорт",
      name: "Проливка заданий на Инвент КИЗ через wh support",
      status: "Бэклог",
      priority: "Средний",
      dependsOn: null,
      roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }],
      resultsHistory: [],
      deadline: "2026-12-31"
    },
    {
      id: 9,
      project: "Поиск",
      name: "Верификация МХ при пропуске товара в модулях «Поиск вещей» и «Инвент КИЗ»",
      status: "Бэклог",
      priority: "Средний",
      dependsOn: null,
      roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 4, planStart: "", planEnd: "", factEnd: "" }],
      resultsHistory: [],
      deadline: "2026-12-31"
    },
    {
      id: 10,
      project: "Инвентаризация",
      name: "Изменение в передачи данных при выгрузке",
      status: "Бэклог",
      priority: "Средний",
      dependsOn: null,
      roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }],
      resultsHistory: [],
      deadline: "2026-12-31"
    },
    {
      id: 27,
      project: "Снятие",
      name: "Отключение оплаты за снятие стикерованного товара с паллет в модуле «Снятие в сетку по заданию»",
      status: "Выполнено",
      priority: "Высокий",
      dependsOn: null,
      roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-05-22", planEnd: "2026-05-25", factEnd: "2026-05-25" }],
      resultsHistory: ["Успешный релиз на продакшн, экономия ФОТ подтверждена"],
      deadline: "2026-06-01"
    }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_yougile_v9');
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
    { role: 'assistant', content: 'Привет! YouGile доска активна. Вы можете управлять задачами, добавлять срезы результатов и запрашивать аналитику.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('wms_hub_yougile_v9', JSON.stringify(tasks));
  }, [tasks]);

  const handleResetToExcel = () => {
    setTasks(initial50Tasks);
    localStorage.setItem('wms_hub_yougile_v9', JSON.stringify(initial50Tasks));
  };

  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newResultItem = formData.resultsHistoryInput.trim();

    if (editingId) {
      setTasks(tasks.map(t => {
        if (t.id === editingId) {
          const updatedHistory = newResultItem 
            ? [...(t.resultsHistory || []), newResultItem] 
            : (t.resultsHistory || []);
          return { ...t, ...formData, resultsHistory: updatedHistory };
        }
        return t;
      }));
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        resultsHistory: newResultItem ? [newResultItem] : []
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

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
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
        reply = `📋 **Сводный отчет по доске YouGile:**\n- Всего задач: ${tasks.length}\n- Выполнено: ${completed.length}\n\n**Зафиксированные срезы и метрики:**\n` +
          completed.map(t => `• [${t.project}] ${t.name} → ${t.resultsHistory?.length ? t.resultsHistory.join('; ') : 'Метрики не указаны'}`).join('\n');
      } else {
        reply = `🤖 Я проанализировал доску YouGile. Вы можете добавлять срезы результатов в карточках задач и запрашивать общий отчет!`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 500);
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  const kanbanColumns = [
    { title: '📋 Бэклог', status: 'Бэклог', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
    { title: '⚙️ В работе', status: 'В работе', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
    { title: '🧪 Тестирование', status: 'Тестирование', color: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' },
    { title: '📦 Удержание', status: 'Удержание', color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
    { title: '🚫 Отмена', status: 'Отмена', color: 'border-rose-500/30 bg-rose-500/5 text-rose-400' },
    { title: '✅ Выполнено', status: 'Выполнено', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' }
  ];

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
      <aside className="w-64 bg-slate-900/90 backdrop-blur border-r border-slate-800 flex flex-col h-screen overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-800 shrink-0 flex items-center gap-3">
          <div className="p-2 bg-fuchsia-600 rounded-xl text-white font-bold">YG</div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100">WMS YouGile Hub</h1>
            <p className="text-[11px] text-slate-400 font-medium">Канбан-доска 2026</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'kanban' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <Kanban size={18} /> Канбан-доска
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <LayoutDashboard size={18} /> Таблица & План/Факт
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
            <Bot size={18} /> ИИ Ассистент
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-fuchsia-600/20">
            <Plus size={16} /> Новая задача
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
              <RefreshCw size={12} /> Загрузить все задачи
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Всего карточек: {tasks.length}
            </span>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'kanban' && (
            <div className="h-full flex flex-col space-y-4">
              <div className="flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Kanban className="text-fuchsia-400" /> Доска задач YouGile
                </h2>
                <div className="text-xs text-slate-400">Всего загружено: {tasks.length} задач</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pb-6 overflow-x-auto flex-1 items-start">
                {kanbanColumns.map(col => {
                  const colTasks = filteredTasks.filter(t => t.status === col.status);
                  return (
                    <div key={col.status} className="bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col max-h-[calc(100vh-200px)] shadow-lg">
                      <div className={`p-4 border-b border-slate-800 flex justify-between items-center font-semibold text-xs rounded-t-2xl ${col.color}`}>
                        <span>{col.title}</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded-full font-mono text-[11px]">{colTasks.length}</span>
                      </div>

                      <div className="p-3 space-y-3 overflow-y-auto flex-1">
                        {colTasks.length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-600 italic">Нет задач</div>
                        ) : (
                          colTasks.map(t => (
                            <div 
                              key={t.id} 
                              className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl space-y-2.5 shadow-sm transition-all group relative">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[10px] font-semibold text-fuchsia-400 uppercase tracking-wider bg-fuchsia-500/10 px-2 py-0.5 rounded">
                                  {t.project}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEditTask(t)} className="text-slate-400 hover:text-fuchsia-400 p-0.5"><Edit3 size={13} /></button>
                                  <button onClick={() => handleDeleteTask(t.id)} className="text-slate-500 hover:text-rose-400 p-0.5"><Trash2 size={13} /></button>
                                </div>
                              </div>

                              <div className="text-xs font-medium text-slate-100 leading-snug">
                                {t.name}
                              </div>

                              {/* Срез результатов на карточке */}
                              {t.resultsHistory && t.resultsHistory.length > 0 && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-[10px] text-emerald-300 space-y-0.5">
                                  <span className="font-semibold">📊 Результаты:</span>
                                  {t.resultsHistory.map((res, i) => (<div key={i}>• {res}</div>))}
                                </div>
                              )}

                              <div className="space-y-1 pt-1 border-t border-slate-900">
                                {Array.isArray(t.roles) && t.roles.map((r, idx) => (
                                  <div key={idx} className="text-[10px] text-slate-400 flex justify-between items-center">
                                    <span className="text-fuchsia-300 font-medium">{r.role}:</span>
                                    <span className="text-slate-300">{r.dev}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-mono">📅 {t.deadline}</span>
                                <select 
                                  value={t.status}
                                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                  className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-fuchsia-500">
                                  <option value="Бэклог">Бэклог</option>
                                  <option value="В работе">В работе</option>
                                  <option value="Тестирование">Тестирование</option>
                                  <option value="Удержание">Удержание</option>
                                  <option value="Отмена">Отмена</option>
                                  <option value="Выполнено">Выполнено</option>
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
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
                        <th className="p-4">Роли, Сотрудники & Результаты</th>
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
                              t.status === 'Выполнено' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'
                            }`}>{t.status}</span>
                          </td>
                          <td className="p-4"><span className="text-xs text-slate-300">{t.priority}</span></td>
                          <td className="p-4 min-w-[300px]">
                            <div className="space-y-1 text-xs">
                              {t.resultsHistory && t.resultsHistory.length > 0 && (
                                <div className="text-emerald-400 font-medium">📊 {t.resultsHistory.join('; ')}</div>
                              )}
                              {Array.isArray(t.roles) && t.roles.map((r, idx) => (
                                <div key={idx} className="text-slate-400">
                                  <span className="text-fuchsia-400">{r.role}:</span> {r.dev} ({r.estimateDays} дн.)
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={() => handleEditTask(t)} className="text-slate-400 hover:text-fuchsia-400"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteTask(t.id)} className="text-slate-500 hover:text-rose-400"><Trash2 size={16} /></button>
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
              <h3 className="text-lg font-semibold text-slate-200">Диаграмма Ганта</h3>
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[900px] space-y-4">
                  {filteredTasks.map(t => (
                    <div key={t.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                      <div className="col-span-4 pr-2">
                        <div className="text-xs font-semibold text-fuchsia-400">[{t.project}]</div>
                        <div className="text-sm text-slate-100 font-medium truncate">{t.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Дедлайн: {t.deadline}</div>
                      </div>
                      <div className="col-span-8 relative bg-slate-900/80 h-7 rounded-lg flex items-center px-2 border border-slate-800">
                        <div className={`absolute left-2 right-4 h-4 rounded-md ${t.status === 'Выполнено' ? 'bg-emerald-500/80' : 'bg-gradient-to-r from-fuchsia-600 to-indigo-500'}`}></div>
                        <span className="relative z-10 text-[11px] font-mono text-white pl-2">Дедлайн: {t.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-semibold text-slate-200">Аналитика по разработчикам</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allDevsList.map(item => {
                  const stats = devStats[item.name] || { tasksCount: 0, role: item.role };
                  return (
                    <div key={item.name} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 shadow-md">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-fuchsia-400">{item.name} <span className="text-xs text-slate-400 font-normal">({item.role})</span></span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">Задач в пуле: {stats.tasksCount}</span>
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
                  <h3 className="font-semibold text-slate-200">Умный ИИ Ассистент YouGile</h3>
                  <p className="text-xs text-slate-400">Анализ всех {tasks.length} задач с доски YouGile</p>
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
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800 flex gap-3 shrink-0">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Спросите 'Отчет по доске'..."
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

      {/* МОДАЛЬНОЕ ОКНО С ПОЛЕМ СРЕЗА РЕЗУЛЬТАТОВ */}
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
                  <label className="text-xs text-slate-400 font-medium">Статус (Колонка доски)</label>
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

              {/* Поле для среза результатов доработки */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs text-fuchsia-400 font-semibold">Срез результатов / Метрики / Что внесла доработка</label>
                <input 
                  type="text" 
                  value={formData.resultsHistoryInput} 
                  onChange={(e) => setFormData({...formData, resultsHistoryInput: e.target.value})} 
                  placeholder="Например: Ускорение обработки ШК на 20%, внедрен новый экран" 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" 
                />
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
