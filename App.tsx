import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, ClipboardList, Plus, RotateCcw } from 'lucide-react'
import { AddTask } from './components/AddTask'
import { Statistics } from './components/Statistics'
import { TaskCard } from './components/TaskCard'
import { useJournal } from './hooks/useJournal'
import type { Task, TaskStatus } from './types'
import { formatDate, shiftDate, toDateKey } from './utils/dates'
import './styles.css'
const today = toDateKey(new Date())
function createId() { return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}` }
export default function App() {
  const { journal, updateDay } = useJournal()
  const [selectedDate, setSelectedDate] = useState(today)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const tasks = journal[selectedDate] ?? []
  const counts = useMemo(() => ({ total: tasks.length, done: tasks.filter(t => t.status === 'done').length, undone: tasks.filter(t => t.status === 'undone').length, pending: tasks.filter(t => t.status === 'pending').length }), [tasks])
  const isFuture = selectedDate > today
  const isFinished = counts.total > 0 && counts.pending === 0
  const daysWithTasks = Object.entries(journal).filter(([, items]) => items.length).sort(([a], [b]) => b.localeCompare(a))
  function addTask(text: string) { const task: Task = { id: createId(), text, date: selectedDate, status: 'pending', reason: '', reasonHistory: [] }; updateDay(selectedDate, all => [...all, task]) }
  function editTask(id: string, text: string) { updateDay(selectedDate, all => all.map(task => task.id === id ? { ...task, text } : task)) }
  function deleteTask(id: string) { updateDay(selectedDate, all => all.filter(task => task.id !== id)) }
  function changeStatus(id: string, status: TaskStatus, reason?: string) {
    updateDay(selectedDate, all => all.map(task => {
      if (task.id !== id) return task
      const history = reason === undefined ? task.reasonHistory : task.reason && task.reason !== reason ? [...task.reasonHistory, task.reason] : task.reasonHistory
      return { ...task, status, reason: reason === undefined ? task.reason : reason, reasonHistory: history }
    }))
  }
  function finishDay() { if (counts.pending) { setConfirmFinish(true); return } setConfirmFinish(false) }
  function confirmCompleteDay() { updateDay(selectedDate, all => all.map(task => task.status === 'pending' ? { ...task, status: 'undone' as const, reason: 'Не отмечена до завершения дня' } : task)); setConfirmFinish(false) }
  return <main className="app-shell">
    <header className="topbar"><a href="#" className="brand" aria-label="Рабочий журнал, главная"><span className="brand-mark"><ClipboardList size={21}/></span><span>Рабочий<span className="brand-muted"> журнал</span></span></a><button className="today-chip" onClick={() => setSelectedDate(today)}><span className="today-dot"/> Сегодня <span className="today-date">{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date())}</span></button></header>
    <div className="dashboard">
      <section className="main-column">
        <div className="page-heading"><div><span className="section-eyebrow">ВАШ ПЛАН И ФОКУС</span><h1>Рабочий журнал</h1><p>Планируйте день и отмечайте свой прогресс</p></div><div className="date-nav"><button className="icon-button nav-button" aria-label="Предыдущий день" onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}><ArrowLeft size={17}/></button><label className="date-picker"><CalendarDays size={16}/><span>{formatDate(selectedDate)}</span><ChevronDown size={14}/><input type="date" value={selectedDate} onChange={e => e.target.value && setSelectedDate(e.target.value)} aria-label="Выбрать дату"/></label><button className="icon-button nav-button" aria-label="Следующий день" disabled={selectedDate >= today} onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}><ArrowRight size={17}/></button></div></div>
        <div className="day-toolbar"><div><h2>Задачи на день</h2><span className="task-count">{counts.total} {counts.total === 1 ? 'задача' : counts.total > 1 && counts.total < 5 ? 'задачи' : 'задач'}</span></div>{!isFuture && <AddTask onAdd={addTask}/>}</div>
        {tasks.length === 0 ? <div className="empty-state"><div className="empty-illustration"><ClipboardList size={26}/><span>+</span></div><h3>{isFuture ? 'Этот день ещё впереди' : 'Пока нет задач'}</h3><p>{isFuture ? 'Задачи можно добавить, когда наступит выбранная дата.' : 'Составьте план, добавив первую задачу на этот день.'}</p>{!isFuture && <button className="button button-dark" onClick={() => document.querySelector<HTMLButtonElement>('.add-task-button')?.click()}><Plus size={16}/> Добавить задачу</button>}</div> : <div className="task-list">{tasks.map((task, index) => <div className="task-row" key={task.id}><span className="task-index">{String(index + 1).padStart(2, '0')}</span><TaskCard task={task} onStatus={(status, reason) => changeStatus(task.id, status, reason)} onEdit={text => editTask(task.id, text)} onDelete={() => deleteTask(task.id)}/></div>)}</div>}
        {tasks.length > 0 && !isFuture && <div className="finish-area">{isFinished ? <div className="finished-note"><span><Check size={16}/></span><div><strong>День завершён</strong><small>Все задачи отмечены. Хорошая работа!</small></div></div> : <><p>Когда закончите, зафиксируйте итоги дня.</p><button className="finish-button" onClick={finishDay}><Check size={16}/> Завершить день</button></>}</div>}
        {confirmFinish && <div className="modal-backdrop" role="presentation" onClick={() => setConfirmFinish(false)}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="finish-title" onClick={e => e.stopPropagation()}><div className="modal-icon"><RotateCcw size={20}/></div><h2 id="finish-title">Завершить этот день?</h2><p>Осталось отметить {counts.pending} {counts.pending === 1 ? 'задачу' : 'задачи'}. Если продолжить, они получат статус «Не выполнено» с причиной «Не отмечена до завершения дня».</p><div className="modal-actions"><button className="button button-light" onClick={() => setConfirmFinish(false)}>Вернуться к задачам</button><button className="button button-dark" onClick={confirmCompleteDay}>Всё равно завершить</button></div></section></div>}
      </section>
      <aside className="side-column"><Statistics {...counts}/><section className="tip-card"><span className="tip-icon">✦</span><div><strong>Один шаг за раз</strong><p>Сфокусируйтесь на одной задаче. Маленький прогресс тоже ведёт к большому результату.</p></div></section><section className="history-panel"><div className="history-heading"><div><span className="section-eyebrow">ВАША ИСТОРИЯ</span><h2>Недавние дни</h2></div><CalendarDays size={17}/></div>{daysWithTasks.length === 0 ? <p className="no-history">Здесь появятся дни с задачами</p> : daysWithTasks.slice(0, 6).map(([date, dayTasks]) => { const complete = dayTasks.filter(task => task.status === 'done').length; return <button className={`history-row ${date === selectedDate ? 'active' : ''}`} key={date} onClick={() => setSelectedDate(date)}><span className="history-date"><strong>{new Intl.DateTimeFormat('ru-RU', { day: 'numeric' }).format(new Date(`${date}T12:00:00`))}</strong><span>{new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(new Date(`${date}T12:00:00`))}</span></span><span className="history-detail"><strong>{new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(new Date(`${date}T12:00:00`))}</strong><small>{complete} из {dayTasks.length} выполнено</small></span><span className={`history-progress ${complete === dayTasks.length ? 'complete' : ''}`}>{complete === dayTasks.length ? <Check size={15}/> : `${Math.round(complete / dayTasks.length * 100)}%`}</span></button> })}</section><p className="storage-note"><span/> Данные сохраняются в этом браузере</p></aside>
    </div><footer className="page-footer">Рабочий журнал <span>·</span> ваш день — ваши достижения</footer>
  </main>
}
