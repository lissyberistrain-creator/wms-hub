import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FolderKanban, Users, Bot, Plus, Trash2, Edit3, Send, Loader2, BarChart2, RefreshCw,
  User, Kanban, Settings, Calendar, Link2, FileText, MessageSquare, Info, Clock, Bold, Italic, 
  List, ListOrdered, Heading1, Heading2, Quote, AlertTriangle, ChevronDown, ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [selectedProject, setSelectedProject] = useState('all');
  const [ganttScale, setGanttScale] = useState('months');

  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [taskModalTab, setTaskModalTab] = useState('chat');
  const [newCommentText, setNewCommentText] = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});

  const full50Tasks = [
    { id: 1, project: "WMS MOBILE", name: "Снятие Рефакторинг", status: "Тестирование", priority: "Высокий", dependsOn: null, roles: [{ role: "Mobile", dev: "Сухоруков Роман", estimateDays: 10, planStart: "2026-04-01", planEnd: "2026-05-05", factEnd: "" }], resultsHistory: ["Успешный прогон автотестов рефакторинга"], deadline: "2026-08-10", startDate: "2026-04-01", comments: [{ author: "Фроленков Денис", text: "Ждем результаты тестирования на складе", time: "05.08.2026 12:40" }], description: "Рефакторинг модуля снятия с ТСД для ускорения отклика." },
    { id: 2, project: "Поиск", name: "Модуль поиска списанных вещей", status: "В работе", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 10, planStart: "2026-07-31", planEnd: "2026-08-03", factEnd: "" }], resultsHistory: [], deadline: "2026-08-10", startDate: "2026-07-31", comments: [], description: "Разработка таблиц БД и API поиска списанных позиций." },
    { id: 3, project: "Инвентаризация", name: "Сервис для валидации ШК", status: "В работе", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-07-31", planEnd: "2026-08-05", factEnd: "" }], resultsHistory: [], deadline: "2026-08-05", startDate: "2026-07-31", comments: [], description: "Валидация штрихкодов перед инвентаризационными заданиями." },
    { id: 4, project: "Отчетность", name: "Переработка отчёта \"Общие показатели инвентаризации\"", status: "В работе", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Довгань Алексей", estimateDays: 14, planStart: "2026-05-08", planEnd: "2026-05-11", factEnd: "" }], resultsHistory: [], deadline: "2026-08-25", startDate: "2026-05-08", comments: [], description: "Обновление OLAP кубов для отчета." },
    { id: 5, project: "Инвентаризация", name: "Точечная инвентаризация по УИН", status: "Бэклог", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 2, planStart: "2026-07-31", planEnd: "2026-08-04", factEnd: "" }], resultsHistory: [], deadline: "2026-08-14", startDate: "2026-07-31", comments: [], description: "" },
    { id: 6, project: "Инвентаризация", name: "Изменение условий отбора улиц для инвентаризации для низкооборачиваемых зон", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 5, planStart: "2026-08-01", planEnd: "2026-08-10", factEnd: "" }], resultsHistory: [], deadline: "2026-08-10", startDate: "2026-08-01", comments: [], description: "" },
    { id: 7, project: "Инвентаризация", name: "Покрытие авто заданиями площадок сейф/супер сейф/питание", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 5, planStart: "2026-08-01", planEnd: "2026-08-10", factEnd: "" }], resultsHistory: [], deadline: "2026-08-10", startDate: "2026-08-01", comments: [], description: "" },
    { id: 8, project: "Саппорт", name: "Проливка заданий на Инвент КИЗ через wh support", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 9, project: "Поиск", name: "Верификация МХ при пропуске товара в модулях «Поиск вещей» и «Инвент КИЗ»", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 4, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 10, project: "Инвентаризация", name: "Изменение в передачи данных при выгрузке", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 11, project: "Поиск", name: "Фото товара в поиске", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Frontend", dev: "Сергей", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 12, project: "Саппорт", name: "Проливка заданий на Поиск через саппорт", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 13, project: "Снятие", name: "Актуальный объём при уплотнении", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Analyst", dev: "Гузенко Антон", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 14, project: "Снятие", name: "Группировка заданий на снятие от сервиса", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 15, project: "Поиск", name: "Идентификация пустых отсканированных стикеров", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 16, project: "Снятие", name: "Исключение пустых МХ из заданий на снятие с палет", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01", comments: [], description: "" },
    { id: 17, project: "Инвентаризация", name: "Авто-печать этикеток МХ", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 18, project: "Мусорные данные", name: "Мусорные данные → превентивный инвент", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 19, project: "Снятие", name: "Адаптивный подход к снятию", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 20, project: "Саппорт", name: "Признак \"Супер сейф\"", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 21, project: "Саппорт", name: "Создание заданий на инвент КБТ по заявкам", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 22, project: "Саппорт", name: "Ограничение для формирования авто задач в модуле снятие по предметам", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 23, project: "Инвентаризация", name: "Сквозной идентификатор заданий на инвент", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 10, planStart: "2026-08-01", planEnd: "2026-09-15", factEnd: "" }], resultsHistory: [], deadline: "2026-09-15", startDate: "2026-08-01", comments: [], description: "" },
    { id: 24, project: "Инвентаризация", name: "Объединение процессов Инвентаризации", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 25, project: "Снятие", name: "Указывать тип подбора после скана баркода", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 26, project: "Инвентаризация", name: "Отдельный параметр сдачи заданий на инвент", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01", comments: [], description: "" },
    { id: 27, project: "Снятие", name: "Отключение оплаты за снятие стикерованного товара с паллет в модуле «Снятие в сетку по заданию»", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-05-22", planEnd: "2026-06-01", factEnd: "2026-06-01" }], resultsHistory: ["Релиз успешен, экономия ФОТ"], deadline: "2026-06-01", startDate: "2026-05-22", comments: [], description: "" },
    { id: 28, project: "Снятие", name: "Признак автозаданий на снятие по сигналу замены товара на сборке", status: "Выполнено", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-05-27", planEnd: "2026-06-01", factEnd: "2026-06-01" }], resultsHistory: ["Оптимизация автозаданий на 15%"], deadline: "2026-06-05", startDate: "2026-05-27", comments: [], description: "" },
    { id: 29, project: "WMS MOBILE", name: "Инвентаризация Рефакторинг", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Mobile", dev: "Сухоруков Роман", estimateDays: 10, planStart: "2026-03-03", planEnd: "2026-03-10", factEnd: "2026-03-10" }], resultsHistory: ["Ускорение ТСД на 25%"], deadline: "2026-06-05", startDate: "2026-03-03", comments: [], description: "" },
    { id: 30, project: "Инвентаризация", name: "Поиск пропущенных вещей в ходе инвентаризации", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 10, planStart: "2025-08-30", planEnd: "2025-09-10", factEnd: "2025-09-10" }], resultsHistory: [], deadline: "2025-09-10", startDate: "2025-08-30", comments: [], description: "" },
    { id: 31, project: "Инвентаризация", name: "Реализация автоматических заданий на инвентаризацию на уровне отдельного стеллажа вместо улицы", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 7, planStart: "2026-03-16", planEnd: "2026-03-25", factEnd: "2026-03-25" }], resultsHistory: [], deadline: "2026-06-15", startDate: "2026-03-16", comments: [], description: "" },
    { id: 32, project: "WMS MOBILE", name: "Инвент КИЗ Рефакторинг", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Mobile", dev: "Сухоруков Роман", estimateDays: 8, planStart: "2026-03-19", planEnd: "2026-03-28", factEnd: "2026-03-28" }], resultsHistory: [], deadline: "2026-06-16", startDate: "2026-03-19", comments: [], description: "" },
    { id: 33, project: "Инвент КБТ", name: "Отключить проверку на тип инвента SHK", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-06-04", planEnd: "2026-06-07", factEnd: "2026-06-07" }], resultsHistory: ["Успешный запуск КБТ без ошибок"], deadline: "2026-06-17", startDate: "2026-06-04", comments: [], description: "" },
    { id: 34, project: "Снятие", name: "Валидация наличия буфера «Задания на раскладку» перед выдачей задания на снятие", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-02-01", planEnd: "2026-02-06", factEnd: "2026-02-06" }], resultsHistory: [], deadline: "2026-06-17", startDate: "2026-02-01", comments: [], description: "" },
    { id: 35, project: "Инвентаризация", name: "Не проставляется номер отсканированного короба \"Инвент по листу\" для обезличенного товара UGI", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-06-10", planEnd: "2026-06-15", factEnd: "2026-06-15" }], resultsHistory: [], deadline: "2026-06-18", startDate: "2026-06-10", comments: [], description: "" },
    { id: 36, project: "Инвент КБТ", name: "Изменение начислений оплаты по операции 9001", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-05-22", planEnd: "2026-05-28", factEnd: "2026-05-28" }], resultsHistory: [], deadline: "2026-06-25", startDate: "2026-05-22", comments: [], description: "" },
    { id: 37, project: "Снятие", name: "Повторное использование тары при снятии на блоках с типом SSF", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 5, planStart: "2026-06-18", planEnd: "2026-06-23", factEnd: "2026-06-23" }], resultsHistory: [], deadline: "2026-06-25", startDate: "2026-06-18", comments: [], description: "" },
    { id: 38, project: "Инвентаризация", name: "Изменение в логике проверки надобности авто заданий", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 4, planStart: "2026-06-25", planEnd: "2026-06-29", factEnd: "2026-06-29" }], resultsHistory: [], deadline: "2026-06-29", startDate: "2026-06-25", comments: [], description: "" },
    { id: 39, project: "Инвентаризация", name: "Передача данных об инвенте в инвент МХ", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Тарасов Алексей", estimateDays: 4, planStart: "2026-06-26", planEnd: "2026-06-30", factEnd: "2026-06-30" }], resultsHistory: [], deadline: "2026-06-30", startDate: "2026-06-26", comments: [], description: "" },
    { id: 40, project: "WMS MOBILE", name: "Сообщение о прохождении обучения", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "Mobile", dev: "Вавулин Елисей", estimateDays: 4, planStart: "2026-06-26", planEnd: "2026-06-30", factEnd: "2026-06-30" }], resultsHistory: [], deadline: "2026-06-30", startDate: "2026-06-26", comments: [], description: "" },
    { id: 41, project: "Саппорт", name: "Полный переход на саппорт", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-06-27", planEnd: "2026-07-02", factEnd: "2026-07-02" }], resultsHistory: [], deadline: "2026-07-02", startDate: "2026-06-27", comments: [], description: "" },
    { id: 42, project: "Инвентаризация", name: "Ограничение формирования авто-заданий на инвентаризацию по типу мест хранения", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-03-01", planEnd: "2026-03-06", factEnd: "2026-03-06" }], resultsHistory: [], deadline: "2026-07-02", startDate: "2026-03-01", comments: [], description: "" },
    { id: 43, project: "Инвентаризация", name: "Добавление нового статуса IAR", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-05-01", planEnd: "2026-05-06", factEnd: "2026-05-06" }], resultsHistory: [], deadline: "2026-07-05", startDate: "2026-05-01", comments: [], description: "" },
    { id: 44, project: "Инвентаризация", name: "Конфликт зон заданий в ходе инвентаризации", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 2, planStart: "2026-05-14", planEnd: "2026-05-16", factEnd: "2026-05-16" }], resultsHistory: [], deadline: "2026-07-16", startDate: "2026-05-14", comments: [], description: "" },
    { id: 45, project: "Инвент КИЗ", name: "Изменение действий в случае если товар упакован в модуле \"Инвент КИЗ\"", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 2, planStart: "2026-05-14", planEnd: "2026-05-16", factEnd: "2026-05-16" }], resultsHistory: [], deadline: "2026-07-16", startDate: "2026-05-14", comments: [], description: "" },
    { id: 46, project: "Инвент КИЗ", name: "Блокировка выдачи товара на Инвент КИЗ, если на него есть активное задание сборки", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Тарасов Алексей", estimateDays: 3, planStart: "2026-05-28", planEnd: "2026-05-31", factEnd: "2026-05-31" }], resultsHistory: [], deadline: "2026-07-22", startDate: "2026-05-28", comments: [], description: "" },
    { id: 47, project: "Инвент КБТ", name: "Добавление типов МХ 1702, 1703, 1704 в тип задания на инвентаризацию МОНО", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-06-17", planEnd: "2026-06-20", factEnd: "2026-06-20" }], resultsHistory: [], deadline: "2026-06-20", startDate: "2026-06-17", comments: [], description: "" },
    { id: 48, project: "Инвент КИЗ", name: "Актуализация стикера Инвент КИЗ в заданиях сотрудников после переклейки.", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 3, planStart: "2026-07-02", planEnd: "2026-07-05", factEnd: "2026-07-05" }], resultsHistory: [], deadline: "2026-07-05", startDate: "2026-07-02", comments: [], description: "" },
    { id: 49, project: "Снятие", name: "Снятие по КИЗ", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 10, planStart: "2025-11-18", planEnd: "2025-11-28", factEnd: "2025-11-28" }], resultsHistory: [], deadline: "2025-11-28", startDate: "2025-11-18", comments: [], description: "" },
    { id: 50, project: "Инвентаризация", name: "Изменение удаления заданий на инвент МХ", status: "Выполнено", priority: "Низкий", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 5, planStart: "2026-06-01", planEnd: "2026-06-10", factEnd: "2026-06-10" }], resultsHistory: [], deadline: "2026-06-10", startDate: "2026-06-01", comments: [], description: "" }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_light_v32');
    if (saved) {
      try { const parsed = JSON.parse(saved); if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed; } catch (e) { /* ignore */ }
    }
    return full50Tasks;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    project: 'WMS MOBILE',
    name: '',
    status: 'Бэклог',
    priority: 'Средний',
    dependsOn: '',
    startDate: '2026-08-01',
    deadline: '2026-12-31',
    roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '2026-08-01', planEnd: '2026-08-10', factEnd: '' }],
    resultsHistoryInput: '',
    description: ''
  });

  const [workLinks, setWorkLinks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_links_v1');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Camunda Workflow', url: 'https://camunda.com', description: 'Схемы бизнес-процессов WMS' },
      { id: 2, name: 'Confluence WMS', url: 'https://confluence.incubator.local', description: 'Функциональные требования и ТСД' }
    ];
  });
  const [newLinkModal, setNewLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState({ name: '', url: '', description: '' });

  const [notesList, setNotesList] = useState(() => {
    const saved = localStorage.getItem('wms_hub_notes_v6');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Встреча с Егором', date: '2026-05-28', completed: true, htmlContent: '<ol><li>Арина (проверка сдачи хп инвентаризации) - завести карточки</li><li>Подключение складов к авто заданиям</li><li>Отчет общие показатели</li></ol>' },
      { id: 2, title: 'Контроль выполнения задач', date: '2026-08-07', completed: false, htmlContent: '<div>Проверить раскатку снятия вещей после рефакторинга ТСД.</div>' }
    ];
  });
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().split('T')[0]);

  const [roleDevelopers, setRoleDevelopers] = useState(() => {
    const saved = localStorage.getItem('wms_hub_roles_v1');
    return saved ? JSON.parse(saved) : {
      'Analyst': ['Фроленков Денис', 'Гузенко Антон'],
      'DB': ['Голик Егор', 'Тарасов Алексей', 'Цветкова Арина'],
      'Backend': ['Брянцев Александр'],
      'Frontend': ['Сергей'],
      'OLAP': ['Довгань Алексей'],
      'Mobile': ['Сухоруков Роман', 'Вавулин Елисей'],
      'Testing': ['Склад', 'QA Отдел']
    };
  });

  const [newDevName, setNewDevName] = useState('');
  const [selectedRoleForNewDev, setSelectedRoleForNewDev] = useState('Backend');

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Привет! Я ИИ-ассистент WMS Hub. Спрашивайте про просрочки ("Найди просрочки"), кварталы, проекты или пишите "Создай задачу: [название]".' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => { localStorage.setItem('wms_hub_light_v32', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('wms_hub_roles_v1', JSON.stringify(roleDevelopers)); }, [roleDevelopers]);
  useEffect(() => { localStorage.setItem('wms_hub_links_v1', JSON.stringify(workLinks)); }, [workLinks]);
  useEffect(() => { localStorage.setItem('wms_hub_notes_v6', JSON.stringify(notesList)); }, [notesList]);

  const handleResetToExcel = () => {
    setTasks(full50Tasks);
    localStorage.setItem('wms_hub_light_v32', JSON.stringify(full50Tasks));
  };

  const projectsList = Array.from(new Set(tasks.map(t => t.project)));

  const handleAddDeveloper = (e) => {
    e.preventDefault();
    if (!newDevName.trim()) return;
    const updated = { ...roleDevelopers };
    if (!updated[selectedRoleForNewDev]) updated[selectedRoleForNewDev] = [];
    if (!updated[selectedRoleForNewDev].includes(newDevName.trim())) {
      updated[selectedRoleForNewDev].push(newDevName.trim());
      setRoleDevelopers(updated);
      setNewDevName('');
      alert('Сотрудник успешно добавлен!');
    }
  };

  const handleRemoveDeveloper = (role, devName) => {
    const updated = { ...roleDevelopers };
    updated[role] = updated[role].filter(d => d !== devName);
    setRoleDevelopers(updated);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const newResultItem = formData.resultsHistoryInput.trim();

    if (editingId) {
      setTasks(tasks.map(t => {
        if (t.id === editingId) {
          const updatedHistory = newResultItem ? [...(t.resultsHistory || []), newResultItem] : (t.resultsHistory || []);
          return { ...t, ...formData, resultsHistory: updatedHistory };
        }
        return t;
      }));
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        resultsHistory: newResultItem ? [newResultItem] : [],
        comments: [],
        description: formData.description || ''
      };
      setTasks([newTask, ...tasks]);
    }

    setFormData({
      project: 'WMS MOBILE',
      name: '',
      status: 'Бэклог',
      priority: 'Средний',
      dependsOn: '',
      startDate: '2026-08-01',
      deadline: '2026-12-31',
      roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '2026-08-01', planEnd: '2026-08-10', factEnd: '' }],
      resultsHistoryInput: '',
      description: ''
    });
    setIsModalOpen(false);
  };

  const handleEditTask = (task, e) => {
    if (e) e.stopPropagation();
    setEditingId(task.id);
    setFormData({
      project: task.project,
      name: task.name,
      status: task.status,
      priority: task.priority,
      dependsOn: task.dependsOn || '',
      startDate: task.startDate || task.roles?.[0]?.planStart || '2026-08-01',
      deadline: task.deadline || '2026-12-31',
      roles: task.roles || [],
      resultsHistoryInput: '',
      description: task.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id, e) => {
    if (e) e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDragStart = (e, taskId) => { e.dataTransfer.setData('text/plain', taskId); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData('text/plain'));
    if (taskId) { setTasks(tasks.map(t => t.id === taskId ? { ...t, status: targetStatus } : t)); }
  };

  const getTotalTaskDays = (task) => {
    if (Array.isArray(task.roles) && task.roles.length > 0) {
      const sum = task.roles.reduce((acc, r) => acc + (Number(r.estimateDays) || 0), 0);
      if (sum > 0) return `${sum} дн.`;
    }
    return '5 дн.';
  };

  const applyExecCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // Исправленный расчет шкалы Ганта без наслоения
  const getGanttBarStyles = (startStr, endStr, scale) => {
    let timelineStart, timelineEnd;
    if (scale === 'years') {
      timelineStart = new Date('2024-01-01').getTime();
      timelineEnd = new Date('2027-12-31').getTime();
    } else if (scale === 'months' || scale === 'weeks') {
      timelineStart = new Date('2025-07-01').getTime();
      timelineEnd = new Date('2026-12-31').getTime();
    } else {
      timelineStart = new Date('2026-08-01').getTime();
      timelineEnd = new Date('2026-08-31').getTime();
    }

    const totalDuration = timelineEnd - timelineStart;
    const sDate = new Date(startStr || '2025-09-01').getTime();
    const eDate = new Date(endStr || '2026-12-31').getTime();

    const clampedStart = Math.max(timelineStart, Math.min(timelineEnd, sDate));
    const clampedEnd = Math.max(timelineStart, Math.min(timelineEnd, eDate));

    const leftPercent = Math.max(0, Math.min(92, ((clampedStart - timelineStart) / totalDuration) * 100));
    const widthPercent = Math.max(3, Math.min(100 - leftPercent, ((clampedEnd - clampedStart) / totalDuration) * 100));

    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const filteredTasks = selectedProject === 'all' ? tasks : tasks.filter(t => t.project === selectedProject);
  const kanbanColumns = [
    { title: '📋 Бэклог', status: 'Бэклог', color: 'border-amber-300 bg-amber-50 text-amber-800' },
    { title: '⚙️ В работе', status: 'В работе', color: 'border-blue-300 bg-blue-50 text-blue-800' },
    { title: '🧪 Тестирование', status: 'Тестирование', color: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
    { title: '📦 Удержание', status: 'Удержание', color: 'border-purple-300 bg-purple-50 text-purple-800' },
    { title: '🚫 Отмена', status: 'Отмена', color: 'border-rose-300 bg-rose-50 text-rose-800' },
    { title: '✅ Выполнено', status: 'Выполнено', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' }
  ];

  const allDevsList = [];
  Object.entries(roleDevelopers).forEach(([roleName, devsArray]) => {
    devsArray.forEach(d => { allDevsList.push({ name: d, role: roleName }); });
  });

  const devAnalytics = {};
  allDevsList.forEach(item => {
    devAnalytics[item.name] = { role: item.role, totalTasks: 0, completedTasks: 0, inProgressTasks: 0, backlogTasks: 0, totalDays: 0, projects: new Set() };
  });

  tasks.forEach(t => {
    if (Array.isArray(t.roles)) {
      t.roles.forEach(r => {
        if (r && r.dev && devAnalytics[r.dev]) {
          const stats = devAnalytics[r.dev];
          stats.totalTasks += 1;
          stats.totalDays += Number(r.estimateDays) || 0;
          stats.projects.add(t.project);
          if (t.status === 'Выполнено') stats.completedTasks += 1;
          else if (t.status === 'В работе' || t.status === 'Тестирование') stats.inProgressTasks += 1;
          else stats.backlogTasks += 1;
        }
      });
    }
  });

  return (
    <div className="min-h-screen text-slate-900 flex font-sans relative overflow-x-hidden" style={{ background: '#f5f6f8' }}>
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0" style={{
        backgroundImage: 'radial-gradient(#cb11ab 0.75px, transparent 0.75px), radial-gradient(#cb11ab 0.75px, #f5f6f8 0.75px)',
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px'
      }}></div>

      <aside className="w-64 bg-white/95 backdrop-blur border-r border-slate-200 flex flex-col h-screen overflow-hidden shrink-0 z-10 shadow-sm">
        <div className="p-6 border-b border-slate-100 shrink-0 flex items-center gap-3">
          <div className="p-2 bg-[#cb11ab] rounded-xl text-white font-bold">RWB</div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">WMS Product Hub</h1>
            <p className="text-[11px] text-slate-500 font-medium">Светлая версия 2026</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button onClick={() => setActiveTab('kanban')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'kanban' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><Kanban size={18} /> Канбан-доска</button>
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><LayoutDashboard size={18} /> Таблица & План/Факт</button>
          <button onClick={() => setActiveTab('gantt')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'gantt' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><FolderKanban size={18} /> Диаграмма Ганта</button>
          <button onClick={() => setActiveTab('reminders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'reminders' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><Clock size={18} /> Напоминания и контроль</button>
          <button onClick={() => setActiveTab('links')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'links' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><Link2 size={18} /> Ссылки для работы</button>
          <button onClick={() => setActiveTab('notes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'notes' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><FileText size={18} /> Заметки & Задачник</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><BarChart2 size={18} /> Аналитика & Команда</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><Settings size={18} /> Настройки команды</button>
          <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100'}`}><Bot size={18} /> ИИ Ассистент</button>
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="w-full flex items-center justify-center gap-2 bg-[#cb11ab] hover:bg-[#b00f95] text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-md">
            <Plus size={16} /> Новая задача
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        <header className="h-18 bg-white/80 backdrop-blur border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Проект:</span>
            <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#cb11ab]">
              <option value="all">Все проекты ({projectsList.length})</option>
              {projectsList.map((p, idx) => (<option key={idx} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleResetToExcel} 
              className="relative z-50 cursor-pointer flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all pointer-events-auto"
            >
              <RefreshCw size={12} /> Загрузить все 50 задач
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Карточек в базе: {tasks.length}
            </span>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* КАНБАН ДОСКА */}
          {activeTab === 'kanban' && (
            <div className="h-full flex flex-col space-y-4">
              <div className="flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Kanban className="text-[#cb11ab]" /> Канбан-доска RWB (Drag and Drop)
                </h2>
                <div className="text-xs text-slate-500">Всего задач: {tasks.length}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pb-6 overflow-x-auto flex-1 items-start">
                {kanbanColumns.map(col => {
                  const colTasks = filteredTasks.filter(t => t.status === col.status);
                  return (
                    <div 
                      key={col.status} 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.status)}
                      className="bg-white border border-slate-200 rounded-2xl flex flex-col max-h-[calc(100vh-200px)] shadow-sm">
                      <div className={`p-4 border-b border-slate-100 flex justify-between items-center font-semibold text-xs rounded-t-2xl ${col.color}`}>
                        <span>{col.title}</span>
                        <span className="bg-white px-2 py-0.5 rounded-full font-mono text-[11px] shadow-sm">{colTasks.length}</span>
                      </div>

                      <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[300px]">
                        {colTasks.length === 0 ? (
                          <div className="text-center py-12 text-xs text-slate-400 italic">Пусто</div>
                        ) : (
                          colTasks.map(t => (
                            <div 
                              key={t.id} 
                              draggable
                              onDragStart={(e) => handleDragStart(e, t.id)}
                              onClick={() => { setSelectedTaskForModal(t); setTaskModalTab('chat'); }}
                              className="bg-white border border-slate-200 hover:border-[#cb11ab] p-3.5 rounded-xl space-y-2.5 shadow-sm transition-all group relative cursor-pointer">
                              
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[10px] font-semibold text-[#cb11ab] uppercase tracking-wider bg-[#cb11ab]/10 px-2 py-0.5 rounded">{t.project}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => handleEditTask(t, e)} className="text-slate-400 hover:text-[#cb11ab] p-0.5"><Edit3 size={13} /></button>
                                  <button onClick={(e) => handleDeleteTask(t.id, e)} className="text-slate-400 hover:text-rose-600 p-0.5"><Trash2 size={13} /></button>
                                </div>
                              </div>

                              <div className="text-xs font-semibold text-slate-800 leading-snug">{t.name}</div>

                              <div className="flex items-center justify-between text-[10px] pt-1">
                                <span className={`px-2 py-0.5 rounded font-medium ${t.priority === 'Высокий' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{t.priority}</span>
                                {t.comments?.length > 0 && <span className="flex items-center gap-1 text-slate-500"><MessageSquare size={11} /> {t.comments.length}</span>}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                                <span className="text-slate-500 font-mono">📅 {t.deadline}</span>
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
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="font-semibold text-lg text-slate-800">Реестр задач</h3>
                  <span className="text-xs text-slate-500">Показано: {filteredTasks.length} из {tasks.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-xs font-medium">
                        <th className="p-4 pl-6">ID / Проект / Задача</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4">Приоритет</th>
                        <th className="p-4">Роли, Сотрудники & Результаты</th>
                        <th className="p-4 pr-6 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTasks.map(t => (
                        <tr key={t.id} onClick={() => { setSelectedTaskForModal(t); setTaskModalTab('chat'); }} className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-2"><span className="text-xs font-mono text-slate-400">#{t.id}</span><span className="text-xs font-semibold text-[#cb11ab]">{t.project}</span></div>
                            <div className="text-slate-800 font-medium mt-1 w-56">{t.name}</div>
                          </td>
                          <td className="p-4"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'Выполнено' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{t.status}</span></td>
                          <td className="p-4"><span className="text-xs text-slate-700">{t.priority}</span></td>
                          <td className="p-4 min-w-[300px]">
                            <div className="space-y-1 text-xs">
                              {t.resultsHistory && t.resultsHistory.length > 0 && <div className="text-emerald-700 font-medium">📊 {t.resultsHistory.join('; ')}</div>}
                              {Array.isArray(t.roles) && t.roles.map((r, idx) => (<div key={idx} className="text-slate-600"><span className="text-[#cb11ab] font-medium">{r.role}:</span> {r.dev} ({r.estimateDays} дн.)</div>))}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={(e) => handleEditTask(t, e)} className="text-slate-400 hover:text-[#cb11ab]"><Edit3 size={16} /></button>
                            <button onClick={(e) => handleDeleteTask(t.id, e)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ИСПРАВЛЕННЫЙ ГАНТ (БЕЗ СМЕЩЕНИЙ И НАСЛОЕНИЙ) */}
          {activeTab === 'gantt' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Calendar className="text-[#cb11ab]" /> Диаграмма Ганта</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-500">Масштаб:</span>
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs">
                    <button onClick={() => setGanttScale('days')} className={`px-3 py-1.5 rounded-lg font-medium transition-all ${ganttScale === 'days' ? 'bg-white text-[#cb11ab] shadow-sm' : 'text-slate-600'}`}>Дни</button>
                    <button onClick={() => setGanttScale('weeks')} className={`px-3 py-1.5 rounded-lg font-medium transition-all ${ganttScale === 'weeks' ? 'bg-white text-[#cb11ab] shadow-sm' : 'text-slate-600'}`}>Недели</button>
                    <button onClick={() => setGanttScale('months')} className={`px-3 py-1.5 rounded-lg font-medium transition-all ${ganttScale === 'months' ? 'bg-white text-[#cb11ab] shadow-sm' : 'text-slate-600'}`}>Месяцы</button>
                    <button onClick={() => setGanttScale('years')} className={`px-3 py-1.5 rounded-lg font-medium transition-all ${ganttScale === 'years' ? 'bg-white text-[#cb11ab] shadow-sm' : 'text-slate-600'}`}>Годы</button>
                  </div>
                </div>
              </div>

              <div className="overflow-auto max-h-[650px] border border-slate-200 rounded-xl relative shadow-sm">
                <div className={ganttScale === 'days' ? 'min-w-[2600px]' : ganttScale === 'weeks' ? 'min-w-[2000px]' : 'min-w-[1600px]'}>
                  <div className="sticky top-0 z-40 bg-slate-100 border-b border-slate-300 shadow-sm flex items-center py-2.5 px-3">
                    <div className="w-80 font-bold text-xs text-slate-700 shrink-0">Название задачи</div>
                    <div className="w-32 font-bold text-xs text-slate-700 shrink-0">Статус</div>
                    <div className="w-24 font-bold text-xs text-slate-700 shrink-0">Дней</div>
                    <div className="flex-1 font-bold text-xs text-slate-600 text-center">
                      {ganttScale === 'years' && 'Шкала времени: 2024 — 2027'}
                      {ganttScale === 'months' && 'Шкала времени по месяцам (2025 - 2026)'}
                      {ganttScale === 'weeks' && 'Недельное расписание'}
                      {ganttScale === 'days' && 'Детализация по дням (Август 2026)'}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white">
                    {filteredTasks.map(t => {
                      const isDone = t.status === 'Выполнено';
                      const isInProgress = t.status === 'В работе' || t.status === 'Тестирование';
                      const barStyle = getGanttBarStyles(t.startDate || '2025-09-01', t.deadline || '2026-12-31', ganttScale);
                      const taskDays = getTotalTaskDays(t);

                      return (
                        <div key={t.id} onClick={() => { setSelectedTaskForModal(t); setTaskModalTab('chat'); }} className="flex items-center text-xs py-2.5 px-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="w-80 pr-2 shrink-0">
                            <span className="text-[10px] font-bold text-[#cb11ab] block">[{t.project}]</span>
                            <span className="font-semibold text-slate-800 truncate block" title={t.name}>{t.name}</span>
                          </div>
                          <div className="w-32 shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium inline-block ${isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{t.status}</span>
                          </div>
                          <div className="w-24 shrink-0 font-mono font-bold text-slate-700 flex items-center gap-1">
                            <Clock size={12} className="text-[#cb11ab]" /> {taskDays}
                          </div>
                          <div className="flex-1 relative bg-slate-50 h-7 rounded-lg flex items-center px-1 border border-slate-200 overflow-hidden ml-4">
                            <div className={`absolute h-4 rounded-md shadow-sm z-10 transition-all ${isDone ? 'bg-emerald-500' : isInProgress ? 'bg-[#cb11ab]' : 'bg-amber-400'}`} style={barStyle}></div>
                            <span className="relative z-20 text-[10px] font-mono text-slate-700 pl-2 font-bold bg-white/80 px-1 rounded">Дедлайн: {t.deadline}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* НАПОМИНАНИЯ */}
          {activeTab === 'reminders' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Clock className="text-[#cb11ab]" /> Напоминания и контроль сроков</h2>
                <p className="text-xs text-slate-500 mt-1">Оперативный контроль горящих дедлайнов и просроченных задач</p>
              </div>

              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const threeDaysLater = new Date();
                threeDaysLater.setDate(threeDaysLater.getDate() + 3);
                const deadlineDate = threeDaysLater.toISOString().split('T')[0];

                const overdue = tasks.filter(t => t.status !== 'Выполнено' && t.deadline && t.deadline < today);
                const burning = tasks.filter(t => t.status !== 'Выполнено' && t.deadline && t.deadline >= today && t.deadline <= deadlineDate);

                return (
                  <div className="space-y-6">
                    <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm space-y-3">
                      <h3 className="font-bold text-rose-800 flex items-center gap-2"><AlertTriangle size={18} /> Просроченные задачи ({overdue.length})</h3>
                      {overdue.length === 0 ? <p className="text-xs text-rose-600 italic">Просрочек нет! Отличная работа.</p> : (
                        overdue.map(t => (
                          <div key={t.id} onClick={() => { setSelectedTaskForModal(t); setTaskModalTab('chat'); }} className="bg-white p-3 rounded-xl border border-rose-200 flex justify-between items-center text-xs cursor-pointer hover:border-rose-400">
                            <div><span className="font-bold text-[#cb11ab]">[{t.project}]</span> <span className="font-semibold text-slate-800">{t.name}</span></div>
                            <span className="font-mono font-bold text-rose-600">Дедлайн: {t.deadline}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl shadow-sm space-y-3">
                      <h3 className="font-bold text-amber-800 flex items-center gap-2"><Clock size={18} /> Горят сроки (дедлайн до {deadlineDate}) ({burning.length})</h3>
                      {burning.length === 0 ? <p className="text-xs text-amber-700 italic">Срочных горящих задач на ближайшие 3 дня нет.</p> : (
                        burning.map(t => (
                          <div key={t.id} onClick={() => { setSelectedTaskForModal(t); setTaskModalTab('chat'); }} className="bg-white p-3 rounded-xl border border-amber-200 flex justify-between items-center text-xs cursor-pointer hover:border-amber-400">
                            <div><span className="font-bold text-[#cb11ab]">[{t.project}]</span> <span className="font-semibold text-slate-800">{t.name}</span></div>
                            <span className="font-mono font-bold text-amber-700">Дедлайн: {t.deadline}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ССЫЛКИ ДЛЯ РАБОТЫ */}
          {activeTab === 'links' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 max-w-5xl">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Link2 className="text-[#cb11ab]" /> Ссылки для работы</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Корпоративные сервисы, документация и инструменты</p>
                </div>
                <button onClick={() => setNewLinkModal(true)} className="bg-[#cb11ab] hover:bg-[#b00f95] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"><Plus size={14} /> Добавить ссылку</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-xs font-medium">
                      <th className="p-4 pl-6">Название сервиса</th>
                      <th className="p-4">URL / Ссылка</th>
                      <th className="p-4">Описание</th>
                      <th className="p-4 pr-6 text-right">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workLinks.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-800">{l.name}</td>
                        <td className="p-4"><a href={l.url} target="_blank" rel="noreferrer" className="text-[#cb11ab] hover:underline font-mono text-xs">{l.url} ↗</a></td>
                        <td className="p-4 text-xs text-slate-600">{l.description}</td>
                        <td className="p-4 pr-6 text-right"><button onClick={() => setWorkLinks(workLinks.filter(item => item.id !== l.id))} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 size={15} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {newLinkModal && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-800">Добавить новую ссылку</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Название сервиса" value={linkForm.name} onChange={(e) => setLinkForm({...linkForm, name: e.target.value})} className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs" />
                    <input type="text" placeholder="https://..." value={linkForm.url} onChange={(e) => setLinkForm({...linkForm, url: e.target.value})} className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs" />
                    <input type="text" placeholder="Описание" value={linkForm.description} onChange={(e) => setLinkForm({...linkForm, description: e.target.value})} className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setNewLinkModal(false)} className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-xl text-xs font-medium">Отмена</button>
                    <button onClick={() => {
                      if (!linkForm.name || !linkForm.url) return;
                      setWorkLinks([...workLinks, { id: Date.now(), ...linkForm }]);
                      setLinkForm({ name: '', url: '', description: '' });
                      setNewLinkModal(false);
                    }} className="bg-[#cb11ab] text-white px-4 py-1.5 rounded-xl text-xs font-semibold">Сохранить</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ЗАМЕТКИ (СВОРАЧИВАЕМЫЕ ПО УМОЛЧАНИЮ) */}
          {activeTab === 'notes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 max-w-5xl">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText className="text-[#cb11ab]" /> Общие заметки и задачник</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ведите протоколы встреч, списки дел и продуктовые заметки</p>
                </div>
              </div>

              <div className="flex gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input type="date" value={newNoteDate} onChange={(e) => setNewNoteDate(e.target.value)} className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800" />
                <input type="text" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} placeholder="Заголовок задачи или встречи..." className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#cb11ab]" />
                <button onClick={() => {
                  if (!newNoteTitle.trim()) return;
                  setNotesList([{ id: Date.now(), title: newNoteTitle.trim(), date: newNoteDate, completed: false, htmlContent: '<div>Введите текст...</div>' }, ...notesList]);
                  setNewNoteTitle('');
                }} className="bg-[#cb11ab] hover:bg-[#b00f95] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md flex items-center gap-1.5">
                  <Plus size={16} /> Создать
                </button>
              </div>

              <div className="space-y-4">
                {notesList.map(note => {
                  const isExpanded = !!expandedNotes[note.id];
                  return (
                    <div key={note.id} className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between bg-white border-b border-slate-100">
                        <div className="flex items-center gap-3 cursor-pointer select-none flex-1" onClick={() => setExpandedNotes({...expandedNotes, [note.id]: !isExpanded})}>
                          {isExpanded ? <ChevronDown size={16} className="text-[#cb11ab]" /> : <ChevronRight size={16} className="text-slate-400" />}
                          <input type="checkbox" checked={note.completed} onClick={(e) => e.stopPropagation()} onChange={() => setNotesList(notesList.map(n => n.id === note.id ? {...n, completed: !n.completed} : n))} className="w-4 h-4 accent-[#cb11ab] rounded cursor-pointer" />
                          <span className={`font-bold text-sm ${note.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{note.title}</span>
                          <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-500">📅 {note.date}</span>
                        </div>
                        <button onClick={() => setNotesList(notesList.filter(n => n.id !== note.id))} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 size={15} /></button>
                      </div>

                      {isExpanded && (
                        <div className="p-4 space-y-3 bg-white">
                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 w-fit">
                            <button type="button" onClick={() => applyExecCommand('bold')} title="Жирный" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Bold size={13} /></button>
                            <button type="button" onClick={() => applyExecCommand('italic')} title="Курсив" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Italic size={13} /></button>
                            <span className="w-px h-4 bg-slate-200 mx-1"></span>
                            <button type="button" onClick={() => applyExecCommand('insertUnorderedList')} title="Список" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><List size={13} /></button>
                            <button type="button" onClick={() => applyExecCommand('insertOrderedList')} title="Нумерованный список" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><ListOrdered size={13} /></button>
                          </div>
                          <div 
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                              const html = e.currentTarget.innerHTML;
                              setNotesList(notesList.map(n => n.id === note.id ? {...n, htmlContent: html} : n));
                            }}
                            dangerouslySetInnerHTML={{ __html: note.htmlContent }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-sans focus:outline-none focus:border-[#cb11ab] min-h-[120px] max-h-[300px] overflow-y-auto leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8 max-w-4xl">
              <div><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Settings className="text-[#cb11ab]" /> Управление сотрудниками и ролями</h3></div>
              <form onSubmit={handleAddDeveloper} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end">
                <div><label className="block text-xs text-slate-600 font-medium mb-1">Имя сотрудника</label><input type="text" value={newDevName} onChange={(e) => setNewDevName(e.target.value)} placeholder="Иванов Иван" className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm" /></div>
                <div><label className="block text-xs text-slate-600 font-medium mb-1">Роль</label><select value={selectedRoleForNewDev} onChange={(e) => setSelectedRoleForNewDev(e.target.value)} className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm">{Object.keys(roleDevelopers).map(r => (<option key={r} value={r}>{r}</option>))}</select></div>
                <button type="submit" className="bg-[#cb11ab] text-white px-5 py-2 rounded-xl text-sm font-semibold">+ Добавить сотрудника</button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(roleDevelopers).map(([role, devs]) => (
                  <div key={role} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-slate-800 text-sm flex justify-between items-center"><span className="text-[#cb11ab]">{role}</span><span className="text-xs bg-white px-2 py-0.5 rounded-full border">{devs.length} чел.</span></div>
                    <div className="space-y-1.5 pt-1">{devs.map(d => (<div key={d} className="bg-white p-2 rounded-lg border flex justify-between items-center text-xs"><span>{d}</span><button onClick={() => handleRemoveDeveloper(role, d)} className="text-slate-400 hover:text-rose-600"><Trash2 size={14} /></button></div>))}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ИСПРАВЛЕННАЯ АНАЛИТИКА (УСТРАНЕН БЕЛЫЙ ЭКРАН) */}
          {activeTab === 'analytics' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Детальная аналитика по разработчикам</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allDevsList.map((item, idx) => {
                  const stats = devAnalytics[item.name] || { role: item.role, totalTasks: 0, completedTasks: 0, inProgressTasks: 0, backlogTasks: 0, totalDays: 0, projects: new Set() };
                  const projectsArr = Array.from(stats.projects || []);
                  return (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-slate-800">{item.name}</h4>
                          <span className="text-xs text-[#cb11ab]">Роль: {item.role}</span>
                        </div>
                        <span className="text-xs bg-[#cb11ab]/10 text-[#cb11ab] px-3 py-1 rounded-full font-semibold">Всего: {stats.totalTasks}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center py-2 bg-white rounded-xl border text-xs">
                        <div><div className="text-slate-500">Выполнено</div><div className="text-sm font-bold text-emerald-600">{stats.completedTasks}</div></div>
                        <div><div className="text-slate-500">В работе</div><div className="text-sm font-bold text-blue-600">{stats.inProgressTasks}</div></div>
                        <div><div className="text-slate-500">Бэклог</div><div className="text-sm font-bold text-amber-600">{stats.backlogTasks}</div></div>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1.5">
                        <div className="flex justify-between"><span>Оценка:</span><strong className="font-mono">{stats.totalDays} раб. дней</strong></div>
                        <div><span>Проекты:</span> <span className="text-slate-700">{projectsArr.join(', ') || 'Нет проектов'}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[650px] max-w-4xl">
              <div className="pb-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3"><div className="p-2.5 bg-[#cb11ab]/10 text-[#cb11ab] rounded-xl"><Bot size={22} /></div><div><h3 className="font-bold text-slate-800">ИИ Ассистент Проекта</h3><p className="text-xs text-slate-500">Спрашивайте про просрочки или пишите *"Создай задачу: [текст]"*</p></div></div>
              </div>
              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#cb11ab] text-white' : 'bg-slate-100 text-[#cb11ab] border'}`}>{msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}</div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${msg.role === 'user' ? 'bg-[#cb11ab] text-white rounded-tr-none' : 'bg-slate-50 border text-slate-800 rounded-tl-none font-mono text-xs'}`}>{msg.content}</div>
                  </div>
                ))}
                {isTyping && (<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-slate-100 text-[#cb11ab] border flex items-center justify-center"><Bot size={16} /></div><div className="p-4 bg-slate-50 border rounded-2xl text-slate-500 text-xs flex items-center gap-2"><Loader2 size={14} className="animate-spin text-[#cb11ab]" /> ИИ думает...</div></div>)}
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!inputMessage.trim()) return;
                const txt = inputMessage;
                setChatMessages(prev => [...prev, { role: 'user', content: txt }]);
                setInputMessage('');
                setIsTyping(true);
                setTimeout(() => {
                  let reply = `🤖 Интеллектуальный поиск: обработал запрос по ${tasks.length} задачам.`;
                  if (txt.toLowerCase().includes('просроч')) {
                    const overdue = tasks.filter(t => t.status !== 'Выполнено' && t.deadline && t.deadline < '2026-08-06');
                    reply = `⚠️ Найдено просроченных задач: ${overdue.length}\n` + overdue.map(t => `• [${t.project}] ${t.name} (дедлайн: ${t.deadline})`).join('\n');
                  }
                  setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
                  setIsTyping(false);
                }, 400);
              }} className="pt-4 border-t border-slate-200 flex gap-3 shrink-0">
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Спросите 'Найди просрочки'..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cb11ab]" />
                <button type="submit" className="bg-[#cb11ab] text-white px-5 py-3 rounded-xl font-medium shadow-md"><Send size={18} /></button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО ЗАДАЧИ */}
      {selectedTaskForModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-6 flex flex-col h-[650px]">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4 shrink-0">
              <div><span className="text-xs font-bold text-[#cb11ab] uppercase">{selectedTaskForModal.project}</span><h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTaskForModal.name}</h3></div>
              <button onClick={() => setSelectedTaskForModal(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-2 text-sm shrink-0">
              <button onClick={() => setTaskModalTab('chat')} className={`font-semibold pb-1 flex items-center gap-1.5 ${taskModalTab === 'chat' ? 'text-[#cb11ab] border-b-2 border-[#cb11ab]' : 'text-slate-500'}`}><MessageSquare size={15} /> Чат ({selectedTaskForModal.comments?.length || 0})</button>
              <button onClick={() => setTaskModalTab('info')} className={`font-semibold pb-1 flex items-center gap-1.5 ${taskModalTab === 'info' ? 'text-[#cb11ab] border-b-2 border-[#cb11ab]' : 'text-slate-500'}`}><Info size={15} /> Инфо / Лог</button>
              <button onClick={() => setTaskModalTab('description')} className={`font-semibold pb-1 flex items-center gap-1.5 ${taskModalTab === 'description' ? 'text-[#cb11ab] border-b-2 border-[#cb11ab]' : 'text-slate-500'}`}><FileText size={15} /> Описание</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {taskModalTab === 'chat' && (
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {(!selectedTaskForModal.comments || selectedTaskForModal.comments.length === 0) ? (
                      <div className="text-center py-16 text-xs text-slate-400 italic">Здесь пока пусто. Напишите сообщение в чат!</div>
                    ) : (
                      selectedTaskForModal.comments.map((c, i) => (
                        <div key={i} className="bg-slate-50 border p-3 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-slate-500"><span className="font-bold text-[#cb11ab]">{c.author}</span><span>{c.time}</span></div>
                          <p className="text-xs text-slate-800">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCommentText.trim() || !selectedTaskForModal) return;
                    const newComment = { author: 'Фроленков Денис', text: newCommentText.trim(), time: new Date().toLocaleString() };
                    const updatedTasks = tasks.map(t => t.id === selectedTaskForModal.id ? { ...t, comments: [...(t.comments || []), newComment] } : t);
                    setTasks(updatedTasks);
                    setSelectedTaskForModal(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
                    setNewCommentText('');
                  }} className="flex gap-2 pt-3 border-t shrink-0">
                    <input type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Написать сообщение..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#cb11ab]" />
                    <button type="submit" className="bg-[#cb11ab] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1"><Send size={14} /> Отправить</button>
                  </form>
                </div>
              )}
              {taskModalTab === 'info' && (
                <div className="space-y-4 text-xs text-slate-700">
                  <div className="bg-slate-50 p-4 rounded-xl border space-y-2"><div><strong>Статус:</strong> {selectedTaskForModal.status}</div><div><strong>Приоритет:</strong> {selectedTaskForModal.priority}</div><div><strong>Дедлайн:</strong> {selectedTaskForModal.deadline}</div></div>
                </div>
              )}
              {taskModalTab === 'description' && (
                <div className="space-y-3">
                  <textarea value={selectedTaskForModal.description || ''} onChange={(e) => {
                    const desc = e.target.value;
                    setSelectedTaskForModal(prev => ({ ...prev, description: desc }));
                    setTasks(tasks.map(t => t.id === selectedTaskForModal.id ? {...t, description: desc} : t));
                  }} placeholder="Описание задачи..." className="w-full h-48 bg-slate-50 border rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#cb11ab]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ/РЕДАКТИРОВАНИЯ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Редактировать задачу' : 'Создать новую задачу'}</h3>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 font-medium">Проект</label><input type="text" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} required className="w-full mt-1 bg-slate-50 border rounded-xl px-4 py-2 text-sm" /></div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Статус</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full mt-1 bg-slate-50 border rounded-xl px-4 py-2 text-sm">
                    <option value="Бэклог">Бэклог</option><option value="В работе">В работе</option><option value="Тестирование">Тестирование</option><option value="Удержание">Удержание</option><option value="Отмена">Отмена</option><option value="Выполнено">Выполнено</option>
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-slate-600 font-medium">Название задачи</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full mt-1 bg-slate-50 border rounded-xl px-4 py-2 text-sm" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-slate-600 font-medium">Дата старта</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full mt-1 bg-slate-50 border rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-slate-600 font-medium">Дедлайн</label><input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full mt-1 bg-slate-50 border rounded-xl px-3 py-2 text-sm" /></div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Приоритет</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full mt-1 bg-slate-50 border rounded-xl px-3 py-2 text-sm">
                    <option value="Низкий">Низкий</option><option value="Средний">Средний</option><option value="Высокий">Высокий</option><option value="Критичный">Критичный</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium">Отмена</button>
                <button type="submit" className="bg-[#cb11ab] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
