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
  Kanban,
  Settings
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [selectedProject, setSelectedProject] = useState('all');

  const [roleDevelopers, setRoleDevelopers] = useState(() => {
    const saved = localStorage.getItem('wms_hub_roles_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
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

  const initial50Tasks = [
    { id: 1, project: "WMS MOBILE", name: "Снятие Рефакторинг", status: "Тестирование", priority: "Высокий", dependsOn: null, roles: [{ role: "Mobile", dev: "Сухоруков Роман", estimateDays: 10, planStart: "2026-04-01", planEnd: "2026-05-05", factEnd: "" }, { role: "Testing", dev: "Склад", estimateDays: 10, planStart: "2026-08-05", planEnd: "2026-08-10", factEnd: "" }], resultsHistory: ["Успешный прогон автотестов рефакторинга"], deadline: "2026-08-10", startDate: "2026-04-01" },
    { id: 2, project: "Поиск", name: "Модуль поиска списанных вещей", status: "В работе", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 10, planStart: "2026-07-31", planEnd: "2026-08-03", factEnd: "" }, { role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-08-03", planEnd: "2026-08-04", factEnd: "" }, { role: "Mobile", dev: "Вавулин Елисей", estimateDays: 4, planStart: "2026-08-04", planEnd: "2026-08-10", factEnd: "" }], resultsHistory: [], deadline: "2026-08-10", startDate: "2026-07-31" },
    { id: 3, project: "Инвентаризация", name: "Сервис для валидации ШК", status: "В работе", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-07-31", planEnd: "2026-08-05", factEnd: "" }], resultsHistory: [], deadline: "2026-08-05", startDate: "2026-07-31" },
    { id: 4, project: "Отчетность", name: "Переработка отчёта \"Общие показатели инвентаризации\"", status: "В работе", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Довгань Алексей", estimateDays: 14, planStart: "2026-05-08", planEnd: "2026-05-11", factEnd: "" }, { role: "Frontend", dev: "Сергей", estimateDays: 10, planStart: "2026-08-11", planEnd: "2026-08-25", factEnd: "" }], resultsHistory: [], deadline: "2026-08-25", startDate: "2026-05-08" },
    { id: 5, project: "Инвентаризация", name: "Точечная инвентаризация по УИН", status: "Бэклог", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 2, planStart: "2026-07-31", planEnd: "2026-08-04", factEnd: "" }, { role: "Backend", dev: "Брянцев Александр", estimateDays: 2, planStart: "2026-08-05", planEnd: "2026-08-07", factEnd: "" }, { role: "Mobile", dev: "Сухоруков Роман", estimateDays: 5, planStart: "2026-08-07", planEnd: "2026-08-14", factEnd: "" }], resultsHistory: [], deadline: "2026-08-14", startDate: "2026-07-31" },
    { id: 6, project: "Инвентаризация", name: "Изменение условий отбора улиц для инвентаризации для низкооборачиваемых зон", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 5, planStart: "2026-08-01", planEnd: "2026-08-10", factEnd: "" }], resultsHistory: [], deadline: "2026-08-10", startDate: "2026-08-01" },
    { id: 7, project: "Инвентаризация", name: "Покрытие авто заданиями площадок сейф/супер сейф/питание", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 5, planStart: "2026-08-01", planEnd: "2026-08-10", factEnd: "" }], resultsHistory: [], deadline: "2026-08-10", startDate: "2026-08-01" },
    { id: 8, project: "Саппорт", name: "Проливка заданий на Инвент КИЗ через wh support", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 9, project: "Поиск", name: "Верификация МХ при пропуске товара в модулях «Поиск вещей» и «Инвент КИЗ»", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 4, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 10, project: "Инвентаризация", name: "Изменение в передачи данных при выгрузке", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 11, project: "Поиск", name: "Фото товара в поиске", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Frontend", dev: "Сергей", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 12, project: "Саппорт", name: "Проливка заданий на Поиск через саппорт", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 3, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 13, project: "Снятие", name: "Актуальный объём при уплотнении", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Analyst", dev: "Гузенко Антон", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 14, project: "Снятие", name: "Группировка заданий на снятие от сервиса", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 15, project: "Поиск", name: "Идентификация пустых отсканированных стикеров", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 16, project: "Снятие", name: "Исключение пустых МХ из заданий на снятие с палет", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-10-31", startDate: "2026-06-01" },
    { id: 17, project: "Инвентаризация", name: "Авто-печать этикеток МХ", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 18, project: "Мусорные данные", name: "Мусорные данные → превентивный инвент", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 19, project: "Снятие", name: "Адаптивный подход к снятию", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 20, project: "Саппорт", name: "Признак \"Супер сейф\"", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 21, project: "Саппорт", name: "Создание заданий на инвент КБТ по заявкам", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 22, project: "Саппорт", name: "Ограничение для формирования авто задач в модуле снятие по предметам", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 23, project: "Инвентаризация", name: "Сквозной идентификатор заданий на инвент", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 10, planStart: "2025-11-01", planEnd: "2025-12-15", factEnd: "" }], resultsHistory: [], deadline: "2026-09-15", startDate: "2025-11-01" },
    { id: 24, project: "Инвентаризация", name: "Объединение процессов Инвентаризации", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 25, project: "Снятие", name: "Указывать тип подбора после скана баркода", status: "Бэклог", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 26, project: "Инвентаризация", name: "Отдельный параметр сдачи заданий на инвент", status: "Бэклог", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "", planEnd: "", factEnd: "" }], resultsHistory: [], deadline: "2026-11-30", startDate: "2026-06-01" },
    { id: 27, project: "Снятие", name: "Отключение оплаты за снятие стикерованного товара с паллет в модуле «Снятие в сетку по заданию»", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-05-22", planEnd: "2026-06-01", factEnd: "2026-06-01" }], resultsHistory: ["Релиз успешен, экономия ФОТ"], deadline: "2026-06-01", startDate: "2026-05-22" },
    { id: 28, project: "Снятие", name: "Признак автозаданий на снятие по сигналу замены товара на сборке", status: "Выполнено", priority: "Низкий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-05-27", planEnd: "2026-06-01", factEnd: "2026-06-01" }], resultsHistory: ["Оптимизация автозаданий на 15%"], deadline: "2026-06-05", startDate: "2026-05-27" },
    { id: 29, project: "WMS MOBILE", name: "Инвентаризация Рефакторинг", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Mobile", dev: "Сухоруков Роман", estimateDays: 10, planStart: "2026-03-03", planEnd: "2026-03-10", factEnd: "2026-03-10" }], resultsHistory: ["Ускорение ТСД на 25%"], deadline: "2026-06-05", startDate: "2026-03-03" },
    { id: 30, project: "Инвентаризация", name: "Поиск пропущенных вещей в ходе инвентаризации", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 10, planStart: "2025-08-30", planEnd: "2025-09-10", factEnd: "2025-09-10" }], resultsHistory: [], deadline: "2025-09-10", startDate: "2025-08-30" },
    { id: 31, project: "Инвентаризация", name: "Реализация автоматических заданий на инвентаризацию на уровне отдельного стеллажа вместо улицы", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 7, planStart: "2026-03-16", planEnd: "2026-03-25", factEnd: "2026-03-25" }], resultsHistory: [], deadline: "2026-06-15", startDate: "2026-03-16" },
    { id: 32, project: "WMS MOBILE", name: "Инвент КИЗ Рефакторинг", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Mobile", dev: "Сухоруков Роман", estimateDays: 8, planStart: "2026-03-19", planEnd: "2026-03-28", factEnd: "2026-03-28" }], resultsHistory: [], deadline: "2026-06-16", startDate: "2026-03-19" },
    { id: 33, project: "Инвент КБТ", name: "Отключить проверку на тип инвента SHK", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-06-04", planEnd: "2026-06-07", factEnd: "2026-06-07" }], resultsHistory: ["Успешный запуск КБТ без ошибок"], deadline: "2026-06-17", startDate: "2026-06-04" },
    { id: 34, project: "Снятие", name: "Валидация наличия буфера «Задания на раскладку» перед выдачей задания на снятие", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-02-01", planEnd: "2026-02-06", factEnd: "2026-02-06" }], resultsHistory: [], deadline: "2026-06-17", startDate: "2026-02-01" },
    { id: 35, project: "Инвентаризация", name: "Не проставляется номер отсканированного короба \"Инвент по листу\" для обезличенного товара UGI", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-06-10", planEnd: "2026-06-15", factEnd: "2026-06-15" }], resultsHistory: [], deadline: "2026-06-18", startDate: "2026-06-10" },
    { id: 36, project: "Инвент КБТ", name: "Изменение начислений оплаты по операции 9001", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-05-22", planEnd: "2026-05-28", factEnd: "2026-05-28" }], resultsHistory: [], deadline: "2026-06-25", startDate: "2026-05-22" },
    { id: 37, project: "Снятие", name: "Повторное использование тары при снятии на блоках с типом SSF", status: "Выполнено", priority: "Высокий", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 5, planStart: "2026-06-18", planEnd: "2026-06-23", factEnd: "2026-06-23" }], resultsHistory: [], deadline: "2026-06-25", startDate: "2026-06-18" },
    { id: 38, project: "Инвентаризация", name: "Изменение в логике проверки надобности авто заданий", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "OLAP", dev: "Гузенко Антон", estimateDays: 4, planStart: "2026-06-25", planEnd: "2026-06-29", factEnd: "2026-06-29" }], resultsHistory: [], deadline: "2026-06-29", startDate: "2026-06-25" },
    { id: 39, project: "Инвентаризация", name: "Передача данных об инвенте в инвент МХ", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Тарасов Алексей", estimateDays: 4, planStart: "2026-06-26", planEnd: "2026-06-30", factEnd: "2026-06-30" }], resultsHistory: [], deadline: "2026-06-30", startDate: "2026-06-26" },
    { id: 40, project: "WMS MOBILE", name: "Сообщение о прохождении обучения", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "Mobile", dev: "Вавулин Елисей", estimateDays: 4, planStart: "2026-06-26", planEnd: "2026-06-30", factEnd: "2026-06-30" }], resultsHistory: [], deadline: "2026-06-30", startDate: "2026-06-26" },
    { id: 41, project: "Саппорт", name: "Полный переход на саппорт", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 5, planStart: "2026-06-27", planEnd: "2026-07-02", factEnd: "2026-07-02" }], resultsHistory: [], deadline: "2026-07-02", startDate: "2026-06-27" },
    { id: 42, project: "Инвентаризация", name: "Ограничение формирования авто-заданий на инвентаризацию по типу мест хранения", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-03-01", planEnd: "2026-03-06", factEnd: "2026-03-06" }], resultsHistory: [], deadline: "2026-07-02", startDate: "2026-03-01" },
    { id: 43, project: "Инвентаризация", name: "Добавление нового статуса IAR", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 5, planStart: "2026-05-01", planEnd: "2026-05-06", factEnd: "2026-05-06" }], resultsHistory: [], deadline: "2026-07-05", startDate: "2026-05-01" },
    { id: 44, project: "Инвентаризация", name: "Конфликт зон заданий в ходе инвентаризации", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 2, planStart: "2026-05-14", planEnd: "2026-05-16", factEnd: "2026-05-16" }], resultsHistory: [], deadline: "2026-07-16", startDate: "2026-05-14" },
    { id: 45, project: "Инвент КИЗ", name: "Изменение действий в случае если товар упакован в модуле \"Инвент КИЗ\"", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 2, planStart: "2026-05-14", planEnd: "2026-05-16", factEnd: "2026-05-16" }], resultsHistory: [], deadline: "2026-07-16", startDate: "2026-05-14" },
    { id: 46, project: "Инвент КИЗ", name: "Блокировка выдачи товара на Инвент КИЗ, если на него есть активное задание сборки", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Тарасов Алексей", estimateDays: 3, planStart: "2026-05-28", planEnd: "2026-05-31", factEnd: "2026-05-31" }], resultsHistory: [], deadline: "2026-07-22", startDate: "2026-05-28" },
    { id: 47, project: "Инвент КБТ", name: "Добавление типов МХ 1702, 1703, 1704 в тип задания на инвентаризацию МОНО", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Голик Егор", estimateDays: 3, planStart: "2026-06-17", planEnd: "2026-06-20", factEnd: "2026-06-20" }], resultsHistory: [], deadline: "2026-06-20", startDate: "2026-06-17" },
    { id: 48, project: "Инвент КИЗ", name: "Актуализация стикера Инвент КИЗ в заданиях сотрудников после переклейки.", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 3, planStart: "2026-07-02", planEnd: "2026-07-05", factEnd: "2026-07-05" }], resultsHistory: [], deadline: "2026-07-05", startDate: "2026-07-02" },
    { id: 49, project: "Снятие", name: "Снятие по КИЗ", status: "Выполнено", priority: "Средний", dependsOn: null, roles: [{ role: "Backend", dev: "Брянцев Александр", estimateDays: 10, planStart: "2025-11-18", planEnd: "2025-11-28", factEnd: "2025-11-28" }], resultsHistory: [], deadline: "2025-11-28", startDate: "2025-11-18" },
    { id: 50, project: "Инвентаризация", name: "Изменение удаления заданий на инвент МХ", status: "Выполнено", priority: "Низкий", dependsOn: null, roles: [{ role: "DB", dev: "Цветкова Арина", estimateDays: 5, planStart: "2026-06-01", planEnd: "2026-06-10", factEnd: "2026-06-10" }], resultsHistory: [], deadline: "2026-06-10", startDate: "2026-06-01" }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wms_hub_light_v25');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length >= 50) return parsed;
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
    startDate: '2025-09-01',
    deadline: '2026-12-31',
    roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '2025-09-01', planEnd: '2025-09-10', factEnd: '' }],
    resultsHistoryInput: ''
  });

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Привет! Я ИИ-ассистент WMS Hub. Спрашивайте про просрочки ("Найди просрочки"), кварталы, проекты или пишите "Создай задачу: [название]".' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('wms_hub_light_v25', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wms_hub_roles_v1', JSON.stringify(roleDevelopers));
  }, [roleDevelopers]);

  const handleResetToExcel = () => {
    setTasks(initial50Tasks);
    localStorage.setItem('wms_hub_light_v25', JSON.stringify(initial50Tasks));
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
      startDate: '2025-09-01',
      deadline: '2026-12-31',
      roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '2025-09-01', planEnd: '2025-09-10', factEnd: '' }],
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
      startDate: task.startDate || task.roles?.[0]?.planStart || '2025-09-01',
      deadline: task.deadline || '2026-12-31',
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
      roles: [...formData.roles, { role: 'DB', dev: 'Голик Егор', estimateDays: 3, planStart: '2025-09-01', planEnd: '2025-09-05', factEnd: '' }]
    });
  };

  const handleRemoveRoleRow = (index) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== index)
    });
  };

  // Умный ИИ с поиском просрочек относительно 2026-08-06
  const handleSendMessage = async (e) => {
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
      const currentDate = '2026-08-06';

      if (lower.includes('создай задачу') || lower.includes('добавь задачу') || lower.includes('новая задача')) {
        let taskName = userText.replace(/создай задачу|добавь задачу|новая задача/gi, '').trim();
        taskName = taskName.replace(/проект\s*[:\-]?\s*[\w\s]+/gi, '').trim();
        if (!taskName) taskName = 'Новая задача от ИИ';

        let detectedProject = 'WMS MOBILE';
        if (lower.includes('сняти')) detectedProject = 'Снятие';
        else if (lower.includes('поиск')) detectedProject = 'Поиск';
        else if (lower.includes('инвент')) detectedProject = 'Инвентаризация';
        else if (lower.includes('саппорт')) detectedProject = 'Саппорт';

        let detectedPriority = 'Средний';
        if (lower.includes('высоки') || lower.includes('критич')) detectedPriority = 'Высокий';

        const createdNewTask = {
          id: Date.now(),
          project: detectedProject,
          name: taskName,
          status: 'Бэклог',
          priority: detectedPriority,
          dependsOn: null,
          startDate: '2026-08-06',
          deadline: '2026-12-31',
          roles: [{ role: 'Backend', dev: 'Брянцев Александр', estimateDays: 5, planStart: '2026-08-06', planEnd: '2026-08-15', factEnd: '' }],
          resultsHistory: []
        };

        setTasks(prev => [createdNewTask, ...prev]);
        reply = `✅ **Задача успешно создана и помещена в Бэклог!**\n- **Проект:** ${detectedProject}\n- **Название:** ${taskName}\n- **Приоритет:** ${detectedPriority}\n- **Статус:** Бэклог`;
      } 
      else if (lower.includes('просроч') || lower.includes('горящ') || lower.includes('дедлайн')) {
        const overdue = tasks.filter(t => t.status !== 'Выполнено' && t.deadline && t.deadline < currentDate);
        reply = `⚠️ **Анализ просрочек и дедлайнов (текущая дата: ${currentDate}):**\n` +
          (overdue.length > 0 
            ? overdue.map(t => `• [${t.project}] **${t.name}** (Дедлайн: ${t.deadline}, Статус: ${t.status})`).join('\n')
            : '🎉 Отличные новости! Просроченных задач по текущему плану на текущую дату не обнаружено.');
      } 
      else if (lower.includes('квартал') || lower.includes('кв')) {
        let qNum = 3;
        if (lower.includes('1 квартал') || lower.includes('1 кв')) qNum = 1;
        else if (lower.includes('2 квартал') || lower.includes('2 кв')) qNum = 2;
        else if (lower.includes('3 квартал') || lower.includes('3 кв')) qNum = 3;
        else if (lower.includes('4 квартал') || lower.includes('4 кв')) qNum = 4;

        const qMonths = qNum === 1 ? ['-01-', '-02-', '-03-'] :
                        qNum === 2 ? ['-04-', '-05-', '-06-'] :
                        qNum === 3 ? ['-07-', '-08-', '-09-'] : ['-10-', '-11-', '-12-'];

        const qTasks = tasks.filter(t => {
          const hasDateMatch = t.roles?.some(r => qMonths.some(m => (r.factEnd && r.factEnd.includes(m)) || (r.planEnd && r.planEnd.includes(m)) || (r.planStart && r.planStart.includes(m)))) || qMonths.some(m => t.deadline?.includes(m) || t.startDate?.includes(m));
          return hasDateMatch;
        });

        reply = `📅 **Сводка по ${qNum} кварталу:**\n- Найдено задач за этот период: **${qTasks.length}**\n` +
          (qTasks.length > 0 ? qTasks.slice(0, 8).map(t => `• [${t.project}] **${t.name}** (Статус: ${t.status})`).join('\n') : 'Задач за этот период не найдено.');
      }
      else if (lower.includes('метрик') || lower.includes('эффект') || lower.includes('профит') || lower.includes('срез') || lower.includes('экономи')) {
        const withMetrics = tasks.filter(t => t.resultsHistory && t.resultsHistory.length > 0);
        reply = `📈 **Анализ профита и метрик от доработок (${withMetrics.length} с результатами):**\n` +
          withMetrics.map(t => `• [${t.project}] **${t.name}**\n  ↳ *Эффект:* ${t.resultsHistory.join('; ')}`).join('\n');
      }
      else if (lower.includes('проект') || lower.includes('сняти') || lower.includes('мобайл') || lower.includes('поиск') || lower.includes('инвент') || lower.includes('саппорт')) {
        const found = tasks.filter(t => t.project.toLowerCase().includes(lower) || t.name.toLowerCase().includes(lower));
        reply = `🔍 Найдено задач по запросу: **${found.length}**.\n` +
          (found.length > 0 ? found.slice(0, 6).map(t => `• [${t.project}] ${t.name} (Статус: ${t.status}, Дедлайн: ${t.deadline})`).join('\n') : 'Задачи не найдены.');
      } 
      else if (lower.includes('загружен') || lower.includes('кто') || lower.includes('разработчик') || lower.includes('команд')) {
        reply = `📊 **Анализ загрузки команды WMS Hub:**\n` +
          `• **Брянцев Александр (Backend):** Задействован в максимальном числе задач (поиск, инвентаризация).\n` +
          `• **Голик Егор (DB):** Модули БД, SQL-запросы, валидация.\n` +
          `• **Сухоруков Роман (Mobile):** Мобильный рефакторинг.`;
      } 
      else {
        reply = `🤖 **Интеллектуальный поиск:** Я проанализировал всю базу из ${tasks.length} задач. Вы можете спросить у меня про просрочки (*"Найди просрочки"*), кварталы (*"Сводка за 3 квартал"*), метрики или написать *"Создай задачу: [название]"*.`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 500);
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

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
    devsArray.forEach(d => {
      allDevsList.push({ name: d, role: roleName });
    });
  });

  const devAnalytics = {};
  allDevsList.forEach(item => {
    devAnalytics[item.name] = {
      role: item.role,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      backlogTasks: 0,
      totalDays: 0,
      projects: new Set()
    };
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

  // Расчет динамической шкалы Ганта с диапазоном от 2025-07-01 по 2026-12-31
  const getGanttBarStyles = (startStr, endStr) => {
    const timelineStart = new Date('2025-07-01').getTime();
    const timelineEnd = new Date('2026-12-31').getTime();
    const totalDuration = timelineEnd - timelineStart;

    const sDate = new Date(startStr || '2025-09-01').getTime();
    const eDate = new Date(endStr || '2026-12-31').getTime();

    const clampedStart = Math.max(timelineStart, Math.min(timelineEnd, sDate));
    const clampedEnd = Math.max(timelineStart, Math.min(timelineEnd, eDate));

    const leftPercent = Math.max(0, Math.min(100, ((clampedStart - timelineStart) / totalDuration) * 100));
    const widthPercent = Math.max(2, Math.min(100 - leftPercent, ((clampedEnd - clampedStart) / totalDuration) * 100));

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`
    };
  };

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
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'kanban' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Kanban size={18} /> Канбан-доска
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <LayoutDashboard size={18} /> Таблица & План/Факт
          </button>
          <button 
            onClick={() => setActiveTab('gantt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'gantt' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <FolderKanban size={18} /> Диаграмма Ганта
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <BarChart2 size={18} /> Аналитика & Команда
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Settings size={18} /> Настройки команды
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-[#cb11ab] text-white shadow-md shadow-[#cb11ab]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Bot size={18} /> ИИ Ассистент
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="w-full flex items-center justify-center gap-2 bg-[#cb11ab] hover:bg-[#b00f95] text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-md">
            <Plus size={16} /> Новая задача
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        <header className="h-18 bg-white/80 backdrop-blur border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Проект:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#cb11ab]">
              <option value="all">Все проекты ({projectsList.length})</option>
              {projectsList.map((p, idx) => (<option key={idx} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleResetToExcel}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all">
              <RefreshCw size={12} /> Загрузить все 50 задач
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Карточек в базе: {tasks.length}
            </span>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'kanban' && (
            <div className="h-full flex flex-col space-y-4">
              <div className="flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Kanban className="text-[#cb11ab]" /> Канбан-доска RWB
                </h2>
                <div className="text-xs text-slate-500">Всего задач: {tasks.length}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pb-6 overflow-x-auto flex-1 items-start">
                {kanbanColumns.map(col => {
                  const colTasks = filteredTasks.filter(t => t.status === col.status);
                  return (
                    <div key={col.status} className="bg-white border border-slate-200 rounded-2xl flex flex-col max-h-[calc(100vh-200px)] shadow-sm">
                      <div className={`p-4 border-b border-slate-100 flex justify-between items-center font-semibold text-xs rounded-t-2xl ${col.color}`}>
                        <span>{col.title}</span>
                        <span className="bg-white px-2 py-0.5 rounded-full font-mono text-[11px] shadow-sm">{colTasks.length}</span>
                      </div>

                      <div className="p-3 space-y-3 overflow-y-auto flex-1">
                        {colTasks.length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-400 italic">Нет задач</div>
                        ) : (
                          colTasks.map(t => (
                            <div 
                              key={t.id} 
                              className="bg-white border border-slate-200 hover:border-[#cb11ab] p-3.5 rounded-xl space-y-2.5 shadow-sm transition-all group relative">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[10px] font-semibold text-[#cb11ab] uppercase tracking-wider bg-[#cb11ab]/10 px-2 py-0.5 rounded">
                                  {t.project}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEditTask(t)} className="text-slate-400 hover:text-[#cb11ab] p-0.5"><Edit3 size={13} /></button>
                                  <button onClick={() => handleDeleteTask(t.id)} className="text-slate-400 hover:text-rose-600 p-0.5"><Trash2 size={13} /></button>
                                </div>
                              </div>

                              <div className="text-xs font-semibold text-slate-800 leading-snug">
                                {t.name}
                              </div>

                              <div className="flex items-center justify-between text-[10px] pt-1">
                                <span className={`px-2 py-0.5 rounded font-medium ${
                                  t.priority === 'Высокий' || t.priority === 'Критичный' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                                }`}>{t.priority || 'Средний'}</span>
                              </div>

                              {t.resultsHistory && t.resultsHistory.length > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-[10px] text-emerald-800 space-y-0.5">
                                  <span className="font-bold">📊 Результаты:</span>
                                  {t.resultsHistory.map((res, i) => (<div key={i}>• {res}</div>))}
                                </div>
                              )}

                              <div className="space-y-1 pt-1 border-t border-slate-100">
                                {Array.isArray(t.roles) && t.roles.map((r, idx) => (
                                  <div key={idx} className="text-[10px] text-slate-600 flex justify-between items-center">
                                    <span className="text-[#cb11ab] font-medium">{r.role}:</span>
                                    <span className="text-slate-800 font-medium">{r.dev}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                                <span className="text-slate-500 font-mono">📅 {t.deadline}</span>
                                <select 
                                  value={t.status}
                                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                  className="bg-slate-100 text-slate-800 border border-slate-300 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-[#cb11ab]">
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
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-400">#{t.id}</span>
                              <span className="text-xs font-semibold text-[#cb11ab]">{t.project}</span>
                            </div>
                            <div className="text-slate-800 font-medium mt-1 w-56">{t.name}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              t.status === 'Выполнено' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                            }`}>{t.status}</span>
                          </td>
                          <td className="p-4"><span className="text-xs text-slate-700">{t.priority}</span></td>
                          <td className="p-4 min-w-[300px]">
                            <div className="space-y-1 text-xs">
                              {t.resultsHistory && t.resultsHistory.length > 0 && (
                                <div className="text-emerald-700 font-medium">📊 {t.resultsHistory.join('; ')}</div>
                              )}
                              {Array.isArray(t.roles) && t.roles.map((r, idx) => (
                                <div key={idx} className="text-slate-600">
                                  <span className="text-[#cb11ab] font-medium">{r.role}:</span> {r.dev} ({r.estimateDays} дн.)
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={() => handleEditTask(t)} className="text-slate-400 hover:text-[#cb11ab]"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteTask(t.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* НАСТОЯЩИЙ ГАНТ С ЯВНЫМ РАЗГРАНИЧЕНИЕМ ПО ГОДАМ И ФИКСИРОВАННОЙ ШАПКОЙ */}
          {activeTab === 'gantt' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold text-slate-800">📊 ГАНТ ПО ЗАДАЧАМ (2025 - 2026)</h3>
                <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> Выполнено</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#cb11ab]"></span> В работе</span>
                </div>
              </div>

              {/* Обертка с вертикальным и горизонтальным скроллом */}
              <div className="overflow-auto max-h-[650px] border border-slate-200 rounded-xl relative shadow-sm">
                <div className="min-w-[2000px]">
                  {/* Зафиксированная шапка сверху с разделением на 2025 и 2026 годы */}
                  <div className="sticky top-0 z-40 bg-slate-100 border-b border-slate-300 shadow-sm">
                    {/* Строка годов с явной линией разделения */}
                    <div className="grid grid-cols-12 text-xs font-bold text-slate-800 text-center py-1.5 border-b border-slate-200">
                      <div className="w-80 text-left pl-4 sticky left-0 bg-slate-100 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Проект & Задача</div>
                      <div className="w-32 sticky left-80 bg-slate-100 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Статус</div>
                      
                      <div className="col-span-8 grid grid-cols-18 text-xs font-bold">
                        <div className="col-span-6 border-r-2 border-[#cb11ab] bg-[#cb11ab]/10 text-[#cb11ab] py-1">📅 2025 ГОД (Июль — Декабрь)</div>
                        <div className="col-span-12 bg-emerald-50 text-emerald-800 py-1">📅 2026 ГОД (Январь — Декабрь)</div>
                      </div>
                    </div>

                    {/* Строка месяцев */}
                    <div className="grid grid-cols-12 text-[10px] font-bold text-slate-600 text-center py-2 items-center">
                      <div className="w-80 text-left pl-4 sticky left-0 bg-slate-100 z-50"></div>
                      <div className="w-32 sticky left-80 bg-slate-100 z-50"></div>
                      
                      <div className="col-span-8 grid grid-cols-18 font-mono">
                        {/* 2025 */}
                        <span>Июл</span><span>Авг</span><span>Сен</span><span>Окт</span><span>Ноя</span><span className="border-r-2 border-[#cb11ab]">Дек</span>
                        {/* 2026 */}
                        <span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span>
                        <span>Июл</span><span>Авг</span><span>Сен</span><span>Окт</span><span>Ноя</span><span>Дек</span>
                      </div>
                    </div>
                  </div>

                  {/* Строки задач */}
                  <div className="divide-y divide-slate-100 bg-white">
                    {filteredTasks.map(t => {
                      const isDone = t.status === 'Выполнено';
                      const isInProgress = t.status === 'В работе' || t.status === 'Тестирование';
                      const barStyle = getGanttBarStyles(t.startDate || '2025-09-01', t.deadline || '2026-12-31');

                      return (
                        <div key={t.id} className="grid grid-cols-12 items-center text-xs py-2.5 px-2 hover:bg-slate-50 transition-colors">
                          <div className="w-80 pr-2 pl-2 sticky left-0 bg-white z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <span className="text-[10px] font-bold text-[#cb11ab] block">[{t.project}]</span>
                            <span className="font-semibold text-slate-800 truncate block" title={t.name}>{t.name}</span>
                          </div>
                          
                          <div className="w-32 sticky left-80 bg-white z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium inline-block ${
                              isDone ? 'bg-emerald-50 text-emerald-700' : isInProgress ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>{t.status}</span>
                          </div>

                          {/* Динамическая шкала Ганта с линией разграничения 2025/2026 */}
                          <div className="col-span-8 relative bg-slate-50 h-7 rounded-lg flex items-center px-1 border border-slate-200 ml-4 overflow-hidden">
                            {/* Вертикальная линия разделения годов на фоне */}
                            <div className="absolute top-0 bottom-0 left-[33.33%] w-[2px] bg-[#cb11ab]/30 z-0"></div>

                            <div className={`absolute h-4 rounded-md shadow-sm z-10 transition-all ${
                              isDone ? 'bg-emerald-500' : isInProgress ? 'bg-[#cb11ab]' : 'bg-amber-400'
                            }`} style={barStyle}></div>
                            <span className="relative z-20 text-[10px] font-mono text-slate-700 pl-2 font-bold bg-white/80 px-1 rounded">
                              {t.startDate ? `${t.startDate} → ` : ''}{t.deadline}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="text-[#cb11ab]" /> Управление сотрудниками и ролями
                </h3>
                <p className="text-xs text-slate-500 mt-1">Добавляйте новых участников разработки или удаляйте старых по ролям</p>
              </div>

              <form onSubmit={handleAddDeveloper} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">Имя сотрудника</label>
                  <input 
                    type="text" 
                    value={newDevName} 
                    onChange={(e) => setNewDevName(e.target.value)} 
                    placeholder="Например: Иванов Иван" 
                    className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#cb11ab]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">Роль</label>
                  <select 
                    value={selectedRoleForNewDev} 
                    onChange={(e) => setSelectedRoleForNewDev(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#cb11ab]">
                    {Object.keys(roleDevelopers).map(r => (<option key={r} value={r}>{r}</option>))}
                  </select>
                </div>
                <button type="submit" className="bg-[#cb11ab] hover:bg-[#b00f95] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all">
                  + Добавить сотрудника
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(roleDevelopers).map(([role, devs]) => (
                  <div key={role} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-slate-800 text-sm flex justify-between items-center">
                      <span className="text-[#cb11ab]">{role}</span>
                      <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">{devs.length} чел.</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {devs.map(d => (
                        <div key={d} className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center text-xs text-slate-700 shadow-sm">
                          <span>{d}</span>
                          <button onClick={() => handleRemoveDeveloper(role, d)} className="text-slate-400 hover:text-rose-600 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Детальная аналитика по разработчикам и загрузке</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allDevsList.map(item => {
                  const stats = devAnalytics[item.name] || { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, backlogTasks: 0, totalDays: 0, projects: new Set() };
                  const projectsArr = Array.from(stats.projects);
                  return (
                    <div key={item.name} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-slate-800">{item.name}</h4>
                          <span className="text-xs text-[#cb11ab] font-medium">Роль: {item.role}</span>
                        </div>
                        <span className="text-xs bg-[#cb11ab]/10 text-[#cb11ab] border border-[#cb11ab]/20 px-3 py-1 rounded-full font-semibold">
                          Всего задач: {stats.totalTasks}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center py-2 bg-white rounded-xl border border-slate-200 text-xs shadow-sm">
                        <div>
                          <div className="text-slate-500">Выполнено</div>
                          <div className="text-sm font-bold text-emerald-600 mt-0.5">{stats.completedTasks}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">В работе</div>
                          <div className="text-sm font-bold text-blue-600 mt-0.5">{stats.inProgressTasks}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Бэклог</div>
                          <div className="text-sm font-bold text-amber-600 mt-0.5">{stats.backlogTasks}</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                        <div className="flex justify-between">
                          <span>Оценка объема работы:</span>
                          <strong className="text-slate-800 font-mono">{stats.totalDays} раб. дней</strong>
                        </div>
                        <div>
                          <span>Проекты в работе:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {projectsArr.length > 0 ? projectsArr.map((p, i) => (
                              <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] shadow-sm">
                                {p}
                              </span>
                            )) : <span className="text-slate-400 italic">Нет активных проектов</span>}
                          </div>
                        </div>
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
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#cb11ab]/10 text-[#cb11ab] rounded-xl border border-[#cb11ab]/20"><Bot size={22} /></div>
                  <div>
                    <h3 className="font-bold text-slate-800">ИИ Ассистент Проекта (Интеллектуальный поиск)</h3>
                    <p className="text-xs text-slate-500">Спросите про просрочки, кварталы, метрики или напишите *"Создай задачу: [текст]"*</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#cb11ab] text-white shadow-sm' : 'bg-slate-100 text-[#cb11ab] border border-slate-200'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${msg.role === 'user' ? 'bg-[#cb11ab] text-white rounded-tr-none' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none font-mono text-xs'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#cb11ab] border border-slate-200 flex items-center justify-center"><Bot size={16} /></div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none text-slate-500 text-xs flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-[#cb11ab]" /> ИИ анализирует базу задач...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-200 flex gap-3 shrink-0">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Спросите 'Сводка по выполненным за 3 квартал', 'Найди просрочки'..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#cb11ab]"
                />
                <button type="submit" className="bg-[#cb11ab] hover:bg-[#b00f95] text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md flex items-center justify-center">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Редактировать задачу' : 'Создать новую задачу в бэклог'}</h3>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-medium">Проект</label>
                  <input type="text" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} required className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Статус (Колонка доски)</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800">
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
                <label className="text-xs text-slate-600 font-medium">Название задачи</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Введите название доработки..." className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium">Дата старта</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Плановый дедлайн</label>
                  <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Приоритет</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800">
                    <option value="Низкий">Низкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Высокий">Высокий</option>
                    <option value="Критичный">Критичный</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[#cb11ab] font-semibold">Участники, роли, плановые и фактические даты</label>
                  <button type="button" onClick={handleAddRoleRow} className="text-xs bg-[#cb11ab]/10 text-[#cb11ab] px-2.5 py-1 rounded-lg border border-[#cb11ab]/20 hover:bg-[#cb11ab]/20">
                    + Добавить роль
                  </button>
                </div>
                {formData.roles.map((r, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <select value={r.role} onChange={(e) => {
                        const role = e.target.value;
                        const dev = roleDevelopers[role]?.[0] || '';
                        setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, role, dev } : item)});
                      }} className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                        {Object.keys(roleDevelopers).map(role => (<option key={role} value={role}>{role}</option>))}
                      </select>

                      <select value={r.dev} onChange={(e) => {
                        const dev = e.target.value;
                        setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, dev } : item)});
                      }} className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800">
                        {(roleDevelopers[r.role] || []).map(dev => (<option key={dev} value={dev}>{dev}</option>))}
                      </select>

                      <input type="number" placeholder="Оценка (дней)" value={r.estimateDays} onChange={(e) => {
                        const estimateDays = Number(e.target.value);
                        setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, estimateDays } : item)});
                      }} className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 items-center pt-1">
                      <div>
                        <span>План старт:</span>
                        <input type="date" value={r.planStart || ''} onChange={(e) => {
                          const planStart = e.target.value;
                          setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, planStart } : item)});
                        }} className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] mt-0.5" />
                      </div>
                      <div>
                        <span>План финиш:</span>
                        <input type="date" value={r.planEnd || ''} onChange={(e) => {
                          const planEnd = e.target.value;
                          setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, planEnd } : item)});
                        }} className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] mt-0.5" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          <span className="text-emerald-700 font-medium">Факт финиша:</span>
                          <input type="date" value={r.factEnd || ''} onChange={(e) => {
                            const factEnd = e.target.value;
                            setFormData({...formData, roles: formData.roles.map((item, i) => i === idx ? { ...item, factEnd } : item)});
                          }} className="w-full bg-white border border-emerald-300 rounded p-1 text-[11px] mt-0.5" />
                        </div>
                        <button type="button" onClick={() => handleRemoveRoleRow(idx)} className="text-rose-600 hover:text-rose-700 text-xs ml-2 mb-1">Удалить</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="text-xs text-[#cb11ab] font-semibold">Срез результатов / Метрики / Что внесла доработка</label>
                <input 
                  type="text" 
                  value={formData.resultsHistoryInput} 
                  onChange={(e) => setFormData({...formData, resultsHistoryInput: e.target.value})} 
                  placeholder="Например: Ускорение обработки ШК на 20%" 
                  className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium">Отмена</button>
                <button type="submit" className="bg-[#cb11ab] hover:bg-[#b00f95] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
