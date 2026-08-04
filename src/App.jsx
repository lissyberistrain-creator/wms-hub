import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Bot, 
  Plus, 
  Trash2, 
  Download, 
  Send,
  Loader2,
  ExternalLink,
  User,
  CheckCircle2,
  Clock,
  Tag
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('all');
  
  // Загружаем задачи из localStorage или используем начальный набор
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 1, project: 'WMS MOBILE', name: 'Снятие Рефакторинг', status: 'Тестирование', priority: 'Высокий', start: '2026-04-01', deadline: '2026-08-10', tags: ['Mobile', 'Testing'] },
      { id: 2, project: 'Поиск', name: 'Модуль поиска списанных вещей', status: 'В работе', priority: 'Средний', start: '2026-07-31', deadline: '2026-08-10', tags: ['DB', 'Backend', 'Mobile'] },
      { id: 3, project: 'Инвентаризация', name: 'Сервис для валидации ШК', status: 'В работе', priority: 'Высокий', start: '2026-07-31', deadline: '2026-08-14', tags: ['DB', 'Backend'] }
    ];
  });

  // Состояние модального окна добавления задачи
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    project: 'WMS MOBILE',
    name: '',
    status: 'Бэклог',
    priority: 'Средний',
    start: '2026-08-01',
    deadline: '2026-08-30',
    tags: 'Mobile'
  });

  // Чат с ИИ
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Привет! Я твой ИИ-ассистент. Я вижу все задачи, которые ты создаешь в системе. Спрашивай о статусах, дедлайнах или распределении проектов!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Сохранение в localStorage при изменении задач
  useEffect(() => {
    localStorage.setItem('wms_hub_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  // Добавление новой задачи
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.name.trim()) return;

    const taskToAdd = {
      id: Date.now(),
      project: newTask.project,
      name: newTask.name,
      status: newTask.status,
      priority: newTask.priority,
      start: newTask.start,
      deadline: newTask.deadline,
      tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setTasks([taskToAdd, ...tasks]);
    setNewTask({ project: 'WMS MOBILE', name: '', status: 'Бэклог', priority: 'Средний', start: '2026-08-01', deadline: '2026-08-30', tags: 'Mobile' });
    setIsModalOpen(false);
  };

  // Удаление задачи
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Интерактивный ИИ-чат
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
      const matched = tasks.filter(t => t.name.toLowerCase().includes(lower) || t.project.toLowerCase().includes(lower));

      if (lower.includes('сколько') || lower.includes('задач')) {
        reply = `📊 Всего в системе создано задач: ${tasks.length}\n- В работе / Тест: ${tasks.filter(t => t.status !== 'Бэклог' && t.status !== 'Выполнено').length}\n- Выполнено: ${tasks.filter(t => t.status === 'Выполнено').length}`;
      } else if (matched.length > 0) {
        reply = `🔍 Нашел задачи (${matched.length} шт.):\n` + matched.map(t => `• [${t.project}] ${t.name} — Статус: ${t.status} (Дедлайн: ${t.deadline})`).join('\n');
      } else {
        reply = `🤖 Я проанализировал ваши текущие задачи (${tasks.length} шт.). Вы можете спросить меня про конкретный проект, дедлайны или добавить новую задачу через интерфейс!`;
      }

      setChatMessages([...newMessages, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 600);
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* Боковое меню */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            WMS Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Интерактивный менеджер 2026</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <LayoutDashboard size={18} /> Дашборд & Задачи
          </button>
          <button 
            onClick={() => setActiveTab('gantt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'gantt' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <FolderKanban size={18} /> Диаграмма Ганта
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <Bot size={18} /> ИИ Ассистент
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-fuchsia-600/20">
            <Plus size={16} /> Новая задача
          </button>
        </div>
      </aside>

      {/* Основной контент */}
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-fuchsia-600/10 hover:bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
            <Plus size={14} /> Добавить задачу
          </button>
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
                    {tasks.filter(t => t.status === 'Выполнено').length}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium">В работе / Тест</div>
                  <div className="text-3xl font-extrabold mt-2 text-blue-400">
                    {tasks.filter(t => t.status === 'В работе' || t.status === 'Тестирование').length}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium">Бэклог</div>
                  <div className="text-3xl font-extrabold mt-2 text-amber-400">
                    {tasks.filter(t => t.status === 'Бэклог').length}
                  </div>
                </div>
              </div>

              {/* Таблица */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-semibold text-lg text-slate-200">Список задач</h3>
                  <span className="text-xs text-slate-400">Показано: {filteredTasks.length} из {tasks.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40 font-medium">
                        <th className="p-4 pl-6">Проект</th>
                        <th className="p-4">Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4">Теги</th>
                        <th className="p-4">Дедлайн</th>
                        <th className="p-4 pr-6 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredTasks.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="p-4 pl-6 font-semibold text-fuchsia-400">{t.project}</td>
                          <td className="p-4 text-slate-200 font-medium">{t.name}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              t.status === 'Выполнено' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              t.status === 'В работе' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              t.status === 'Тестирование' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                              t.priority === 'Высокий' || t.priority === 'Критичный' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {t.tags?.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-mono text-xs">{t.deadline}</td>
                          <td className="p-4 pr-6 text-right">
                            <button 
                              onClick={() => handleDeleteTask(t.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1">
                              <Trash2 size={16} />
                            </button>
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h3 className="text-lg font-semibold text-slate-200">Визуальный график и дедлайны</h3>
              <div className="space-y-4">
                {filteredTasks.map(t => (
                  <div key={t.id} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold text-fuchsia-400 mr-2">[{t.project}]</span> 
                        <span className="text-slate-200 font-medium">{t.name}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {t.start} → <span className="text-slate-200">{t.deadline}</span>
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

          {activeTab === 'ai' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-[calc(100vh-160px)] flex flex-col justify-between">
              <div className="pb-4 border-b border-slate-800 flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-600/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">ИИ Ассистент Проекта</h3>
                  <p className="text-xs text-slate-400">Интерактивный чат с учетом ваших созданных задач</p>
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
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-fuchsia-400 border border-slate-700 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-fuchsia-400" /> Ассистент анализирует задачи...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800 flex gap-3">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Спросите о задачах, дедлайнах или статусах..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
                <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-fuchsia-600/20 flex items-center justify-center">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Модальное окно добавления задачи */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-100">Создать новую задачу</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium">Проект</label>
                <input 
                  type="text"
                  value={newTask.project}
                  onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Название задачи</label>
                <input 
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  required
                  placeholder="Например: Рефакторинг модуля..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Статус</label>
                  <select 
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500">
                    <option value="Бэклог">Бэклог</option>
                    <option value="В работе">В работе</option>
                    <option value="Тестирование">Тестирование</option>
                    <option value="Выполнено">Выполнено</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Приоритет</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500">
                    <option value="Низкий">Низкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Высокий">Высокий</option>
                    <option value="Критичный">Критичный</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Дата старта</label>
                  <input 
                    type="date"
                    value={newTask.start}
                    onChange={(e) => setNewTask({...newTask, start: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Дедлайн</label>
                  <input 
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Теги (через запятую)</label>
                <input 
                  type="text"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                  placeholder="Mobile, Backend, DB"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Отмена
                </button>
                <button 
                  type="submit"
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-fuchsia-600/20">
                  Добавить задачу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
