import { useState } from 'react'
import { Check, Circle, CircleX, Pencil, Trash2, X } from 'lucide-react'
import type { Task, TaskStatus } from '../types'
interface Props { task: Task; onStatus: (status: TaskStatus, reason?: string) => void; onEdit: (text: string) => void; onDelete: () => void }
export function TaskCard({ task, onStatus, onEdit, onDelete }: Props) {
  const [reason, setReason] = useState('')
  const [showReason, setShowReason] = useState(false)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(task.text)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  function saveReason() {
    if (!reason.trim()) { setError('Укажите причину, чтобы отметить задачу невыполненной.'); return }
    onStatus('undone', reason.trim()); setReason(''); setError(''); setShowReason(false)
  }
  const statusLabel = task.status === 'done' ? 'Выполнено' : task.status === 'undone' ? 'Не выполнено' : 'Не отмечено'
  return <article className={`task-card status-${task.status}`}>
    <div className="task-main">
      <span className={`status-icon ${task.status}`} aria-hidden="true">{task.status === 'done' ? <Check size={16}/> : task.status === 'undone' ? <X size={16}/> : <Circle size={16}/>}</span>
      <div className="task-copy">
        {editing ? <form className="inline-edit" onSubmit={e => { e.preventDefault(); if (text.trim()) { onEdit(text.trim()); setEditing(false) } }}><input autoFocus value={text} onChange={e => setText(e.target.value)} aria-label="Текст задачи"/><button className="icon-button" aria-label="Сохранить"><Check size={16}/></button><button type="button" className="icon-button" aria-label="Отмена" onClick={() => { setText(task.text); setEditing(false) }}><X size={16}/></button></form> : <p className={`task-title ${task.status === 'done' ? 'completed' : ''}`}>{task.text}</p>}
        {task.reason && <button className="reason-link" onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Скрыть причину' : task.status === 'undone' ? 'Причина невыполнения' : 'Причина предыдущей отметки'} <span>·</span> {task.reason}</button>}
        {task.reasonHistory.length > 0 && showHistory && <div className="history-note">Предыдущие причины: {task.reasonHistory.map((item, i) => <span key={`${item}-${i}`}>{item}{i < task.reasonHistory.length - 1 ? ' · ' : ''}</span>)}</div>}
      </div>
      <div className="task-tools"><span className={`status-pill ${task.status}`}>{statusLabel}</span><button className="icon-button" title="Изменить задачу" aria-label="Изменить задачу" onClick={() => setEditing(true)}><Pencil size={15}/></button><button className="icon-button delete-button" title="Удалить задачу" aria-label="Удалить задачу" onClick={onDelete}><Trash2 size={15}/></button></div>
    </div>
    {showReason && <form className="reason-form" onSubmit={e => { e.preventDefault(); saveReason() }}><label htmlFor={`reason-${task.id}`}>Причина невыполнения</label><div className="reason-input-row"><input id={`reason-${task.id}`} autoFocus placeholder="Например: ожидание ответа от коллеги" value={reason} onChange={e => { setReason(e.target.value); setError('') }}/><button className="button button-dark" type="submit">Сохранить</button><button type="button" className="icon-button" aria-label="Отмена" onClick={() => { setShowReason(false); setError('') }}><X size={17}/></button></div>{error && <p className="field-error" role="alert">{error}</p>}</form>}
    <div className="task-actions">
      {task.status !== 'done' && <button className="action-button action-done" onClick={() => { setShowReason(false); onStatus('done') }}><Check size={15}/> Отметить выполненной</button>}
      {task.status !== 'undone' && <button className="action-button action-undone" onClick={() => { setReason(''); setError(''); setShowReason(true) }}><CircleX size={15}/> Отметить невыполненной</button>}
      {task.status === 'undone' && <button className="action-button action-reset" onClick={() => { setShowReason(false); onStatus('pending') }}>Сбросить статус</button>}
    </div>
  </article>
}
