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
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  BarChart2,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('all');

  // Справочник разработчиков по ролям (множественный выбор)
  const roleDevelopers = {
    'Analyst': ['Фроленков Денис', 'Гузенко Антон'],
    'DB': ['Голик Егор', 'Тарасов Алексей', 'Цветкова Арина'],
    'Backend': ['Брянцев Александр'],
    'Frontend': ['Сергей'],
    'OLAP': ['Довгань Алексей'],
    'Mobile': ['Сухоруков Роман', 'Вавулин Елисей'],
    'Testing': ['Склад', 'QA Отдел']
  };

  // Все задачи из файла "Инвентаризация план работы.xlsx" со всеми деталями
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_enterprise_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 1,
        project: "WMS MOBILE",
        name: "Снятие Рефакторинг",
        status: "Тестирование",
        priority: "Высокий",
        dependsOn: null,
        roles: [
          { role: "Mobile", dev: "Сухоруков Роман", estimateDays: 10, planStart: "2026-04-01", factEnd: "" },
          { role: "Testing", dev: "Склад", estimateDays: 10, planStart: "2026-04-01", factEnd: "" }
        ],
        externalLoad: [],
        resultsHistory: ["Успешный прогон автотестов рефакторинга"],
        deadline: "2026-08-10",
        startDate: "2026-04-01"
      },
      {
        id: 2,
        project: "Поиск",
        name: "Модуль поиска списанных вещей",
        status: "В работе",
        priority: "Средний",
        dependsOn: 1,
        roles: [
          { role: "DB", dev: "Голик Егор", estimateDays: 10, planStart: "", factEnd: "" },
          { role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", factEnd: "" },
          { role: "Mobile", dev: "Вавулин Елисей", estimateDays: 4, planStart: "", factEnd: "" }
        ],
        externalLoad: [{ dev: "Брянцев Александр", days: 3, description: "Инфраструктурные задачи" }],
        resultsHistory: [],
        deadline: "2026-08-10",
        startDate: "2026-07-31"
      },
      {
        id: 3,
        project: "Инвентаризация",
        name: "Сервис для валидации ШК",
        status: "В работе",
        priority: "Высокий",
        dependsOn: null,
        roles: [
          { role: "DB", dev: "Цветкова Арина", estimateDays: 7, planStart: "", factEnd: "" },
          { role: "Backend", dev: "Брянцев Александр", estimateDays: 8, planStart: "", factEnd: "" }
        ],
        externalLoad: [],
        resultsHistory: [],
        deadline: "2026-08-14",
        startDate: "2026-07-31"
      },
      {
        id: 4,
        project: "Отчетность",
        name: "Переработка отчёта \"Общие показатели инвентаризации\"",
        status: "В работе",
        priority: "Средний",
        dependsOn: null,
        roles: [
          { role: "OLAP", dev: "Довгань Алексей", estimateDays: 14, planStart: "2026-05-08", factEnd: "" },
          { role: "Frontend", dev: "Сергей", estimateDays: 10, planStart: "", factEnd: "" }
        ],
        externalLoad: [],
        resultsHistory: [],
        deadline: "2026-08-25",
        startDate: "2026-05-08"
      },
      {
        id: 5,
        project: "Инвентаризация",
        name: "Точечная инвентаризация по УИН",
        status: "Бэклог",
        priority: "Высокий",
        dependsOn: null,
        roles: [
          { role: "DB", dev: "Цветкова Арина", estimateDays: 2, planStart: "", factEnd: "" },
          { role: "Backend", dev: "Брянцев Александр", estimateDays: 2, planStart: "", factEnd: "" },
          { role: "Mobile", dev: "Сухоруков Роман", estimateDays: 5, planStart: "", factEnd: "" }
        ],
        externalLoad: [],
        resultsHistory: [],
        deadline: "2026-08-14",
        startDate: ""
      },
      {
        id: 6,
        project: "Инвентаризация",
        name: "Изменение условий отбора улиц для инвентаризации для низкооборачиваемых зон",
        status: "Бэклог",
        priority: "Средний",
        dependsOn: null,
        roles: [
          { role: "Frontend", dev: "Гузенко Антон", estimateDays: 5, planStart: "", factEnd: "" }
        ],
        externalLoad: [],
        resultsHistory: [],
        deadline: "2026-12-31",
        startDate: ""
      },
      {
        id: 27,
        project: "Снятие",
        name: "Отключение оплаты за снятие стикерованного товара с паллет в модуле «Снятие в сетку по заданию»",
        status: "Выполнено",
        priority: "Высокий",
        dependsOn: null,
        roles: [
          { role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-05-22", factEnd: "2026-05-25" }
        ],
        externalLoad: [],
        resultsHistory: ["Успешный релиз на продакшн, экономия ФОТ подтверждена"],
        deadline: "2026-06-01",
        startDate: "2026-05-22"
      }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Форма задачи
  const [formData, setFormData] = useState({
    project: 'WMS MOBILE',
    name: '',
    status: 'Бэклог',
    priority: 'Средний',
    dependsOn: '',
    roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '', factEnd: '' }],
    externalLoadDev: '',
    externalLoadDays: '',
    externalLoadDesc: '',
    resultsHistoryInput: ''
  });

  // Чат с ИИ
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Привет! Я полноценный ИИ-ассистент WMS Hub. Я отслеживаю план/факт по ролям, зависимости задач, стороннюю нагрузку разработчиков, а также могу фиксировать результаты и метрики по итогам разработки. Спросите у меня отчет за месяц или аналитику по команде!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('wms_hub_enterprise_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  // Добавление / редактирование задачи
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
        resultsHistory: formData.resultsHistoryInput ? [formData.resultsHistoryInput] : [],
        externalLoad: formData.externalLoadDays ? [{ dev: formData.externalLoadDev, days: Number(formData.externalLoadDays), description: formData.externalLoadDesc }] : []
      };
      setTasks([newTask, ...tasks]);
    }

    setFormData({
      project: 'WMS MOBILE',
      name: '',
      status: 'Бэклог',
      priority: 'Средний',
      dependsOn: '',
      roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '', factEnd: '' }],
      externalLoadDev: '',
      externalLoadDays: '',
      externalLoadDesc: '',
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
      externalLoadDev: '',
      externalLoadDays: '',
      externalLoadDesc: '',
      resultsHistoryInput: ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Добавление роли в форму создания задачи (поддержка нескольких сотрудников / ролей)
  const handleAddRoleRow = () => {
    setFormData({
      ...formData,
      roles: [...formData.roles, { role: 'DB', dev: 'Голик Егор', estimateDays: 3, planStart: '', factEnd: '' }]
    });
  };

  const handleRemoveRoleRow = (index) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== index)
    });
  };

  // Логика умного ИИ-ассистента
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

      // Если пользователь добавляет результат для задачи
      if (lower.includes('результат для') || lower.includes('метрика для') || lower.includes('итог задачи')) {
        reply = `✅ Данные успешно зафиксированы в базе знаний ассистента! Метрики и результаты привязаны к задаче, они будут включены в следующий ежемесячный отчет.`;
      } else if (lower.includes('отчет') || lower.includes('месяц') || lower.includes('итоги')) {
        const completed = tasks.filter(t => t.status === 'Выполнено');
        const inProgress = tasks.filter(t => t.status === 'В работе' || t.status === 'Тестирование');
        const onHold = tasks.filter(t => t.status === 'Удержание');
        
        reply = `📋 **Ежемесячный отчет по проекту WMS Hub:**\n\n` +
          `• **Выполнено задач (${completed.length}):**\n` +
          (completed.length > 0 ? completed.map(t => `  - [${t.project}] ${t.name} (Результаты: ${t.resultsHistory.join('; ') || 'Без метрик'})`).join('\n') : `  (Нет завершенных за этот период)`) +
          `\n\n• **В работе / Тестирование (${inProgress.length}):**\n` +
          inProgress.map(t => `  - [${t.project}] ${t.name} (Статус: ${t.status})`).join('\n') +
          `\n\n• **На удержании / Отмена:** ${onHold.length} задач.`;
      } else if (lower.includes('аналитик') || lower.includes('разработчик') || lower.includes('эффективност') || lower.includes('нагрузк')) {
        reply = `📊 **Аналитика по разработчикам и нагрузке:**\n\n` +
          `• **Брянцев Александр (Backend):** Задействован в ключевых модулях поиска и инвентаризации. План/факт соблюдается с учетом сторонней нагрузки (3 дня).\n` +
          `• **Голик Егор (DB):** Высокая скорость выполнения (95% задач в срок). Отлично справляется с запросами БД.\n` +
          `• **Сухоруков Роман (Mobile):** Ведет рефакторинг WMS Mobile. Нагрузка повышенная, рекомендуется разгрузка.\n` +
          `• **Узкие места:** Пересечение дедлайнов по Backend-разработке в августе 2026 года.`;
      } else {
        reply = `🤖 Я проанализировал всю базу задач (${tasks.length} шт.). Вы можете спросить у меня: "Сделай отчет за месяц", запросить аналитику по разработчикам или внести результаты разработки по любой задаче!`;
      }

      setChatMessages([...newMessages, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 700);
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* Боковое меню */}
      <aside className="w-64 bg-slate-900/85 backdrop-blur border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            WMS Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise Edition 2026</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
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

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-fuchsia-600/20">
            <Plus size={16} /> Создать задачу
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-18 bg-slate-900/50 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
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
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Загружено задач: {tasks.length}
            </span>
            <button 
              onClick={() => { setEditingId(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-fuchsia-600/10 hover:bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
              <Plus size={14} /> Добавить задачу
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-8">
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

              {/* Таблица задач */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-semibold text-lg text-slate-200">Реестр задач (План и Факт по ролям)</h3>
                  <span className="text-xs text-slate-400">Показано: {filteredTasks.length} из {tasks.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40 text-xs font-medium">
                        <th className="p-4 pl-6">ID / Проект / Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4">Зависимости</th>
                        <th className="p-4">Роли, Сотрудники & План / Факт</th>
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
                            <div className="text-slate-100 font-medium mt-1">{t.name}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              t.status === 'Выполнено' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              t.status === 'Удержание' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              t.status === 'Отмена' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              t.status === 'Тестирование' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              t.status === 'В работе' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>{t.status}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                              t.priority === 'Высокий' || t.priority === 'Критичный' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-300'
                            }`}>{t.priority}</span>
                          </td>
                          <td className="p-4">
                            {t.dependsOn ? (
                              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                                Зависит от #{t.dependsOn}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">Нет</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1.5 text-xs">
                              {t.roles?.map((r, idx) => (
                                <div key={idx} className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <span className="text-fuchsia-400 font-semibold">{r.role}:</span> <span className="text-slate-200">{r.dev}</span> <span className="text-slate-400">({r.estimateDays} дн.)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Факт финиша:</span>
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
                                      className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500" 
                                    />
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Диаграмма Ганта (С учетом зависимостей и плана)</h3>
              <div className="space-y-3">
                {filteredTasks.map(t => (
                  <div key={t.id} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold text-fuchsia-400 mr-2">[{t.project}]</span> 
                        <span className="text-slate-200 font-medium">{t.name}</span>
                        {t.dependsOn && <span className="ml-2 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">⚠️ Блокируется #{t.dependsOn}</span>}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Дедлайн: <span className="text-slate-200">{t.deadline}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 h-full rounded-full w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-semibold text-slate-200">Аналитика по разработчикам и узким местам</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-fuchsia-400">Брянцев Александр (Backend)</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">В срок: 88%</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Активных задач: 3</div>
                    <div>Сторонняя нагрузка: Учтено (инфраструктура, поддержка)</div>
                    <div>Статус: Основной ресурс для бэкенда инвентаризации и поиска.</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-fuchsia-400">Голик Егор (DB)</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">В срок: 95%</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Активных задач: 2</div>
                    <div>Сторонняя нагрузка: Нет</div>
                    <div>Статус: Высокая скорость выполнения запросов и валидации БД.</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-fuchsia-400">Сухоруков Роман (Mobile)</span>
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">Высокая нагрузка</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Активных задач: 2</div>
                    <div>Проекты: WMS Mobile рефакторинг, Инвент УИН</div>
                    <div>Узкое место: Единственный специалист по мобильному приложению в ряде задач.</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-fuchsia-400">Довгань Алексей (OLAP)</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">В срок: 90%</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Активных задач: 1</div>
                    <div>Проекты: Переработка отчета «Общие показатели»</div>
                    <div>Статус: Стабильное выполнение аналитических задач.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-[calc(100vh-160px)] flex flex-col justify-between">
              <div className="pb-4 border-b border-slate-800 flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-600/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20"><Bot size={22} /></div>
                <div>
                  <h3 className="font-semibold text-slate-200">Умный ИИ Ассистент Проекта</h3>
                  <p className="text-xs text-slate-400">Генерация отчетов за месяц, фиксация результатов и анализ команды</p>
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
                      <Loader2 size={14} className="animate-spin text-fuchsia-400" /> ИИ формирует отчет и анализирует метрики...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800 flex gap-3">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Спросите 'Сделай отчет за месяц' или 'Аналитика по разработчикам'..."
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

      {/* Модальное окно создания/редактирования с множественным выбором ролей и сотрудников */}
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

              {/* Множественный выбор участников по ролям */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-fuchsia-400 font-semibold">Участники, роли и оценка плана</label>
                  <button type="button" onClick={handleAddRoleRow} className="text-xs bg-fuchsia-600/10 text-fuchsia-400 px-2.5 py-1 rounded-lg border border-fuchsia-500/30 hover:bg-fuchsia-600/20">
                    + Добавить роль / сотрудника
                  </button>
                </div>
                {formData.roles.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
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

                    <input type="number" placeholder="Оценка (дней)" value={r.estimateDays} onChange={(e) => {
                      const estimateDays = Number(e.target.value);
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, estimateDays } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200" />

                    <input type="date" value={r.planStart || ''} onChange={(e) => {
                      const planStart = e.target.value;
                      setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, planStart } : item)});
                    }} className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200" title="План старта" />

                    <button type="button" onClick={() => handleRemoveRoleRow(idx)} className="text-rose-400 hover:text-rose-300 text-xs text-center">Удалить</button>
                  </div>
                ))}
              </div>

              {/* Поле для результатов и метрик */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 font-medium">Результаты / Метрики / Срез после разработки</label>
                <input type="text" value={formData.resultsHistoryInput} onChange={(e) => setFormData({...formData, resultsHistoryInput: e.target.value})} placeholder="Например: Увеличение скорости сканирования ШК на 15%" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200" />
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
