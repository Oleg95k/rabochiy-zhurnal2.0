import { useState, type FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
interface Props { onAdd: (text: string) => void }
export function AddTask({ onAdd }: Props) {
  const [open, setOpen] = useState(false), [text, setText] = useState(''), [error, setError] = useState('')
  function submit(e: FormEvent) { e.preventDefault(); if (!text.trim()) { setError('Введите текст задачи.'); return } onAdd(text.trim()); setText(''); setError(''); setOpen(false) }
  if (!open) return <button className="add-task-button" onClick={() => setOpen(true)}><Plus size={18}/> Добавить задачу</button>
  return <form className="add-task-form" onSubmit={submit}><div className="add-form-head"><div><strong>Новая задача</strong><span>Что нужно успеть сегодня?</span></div><button type="button" className="icon-button" aria-label="Закрыть" onClick={() => { setOpen(false); setError('') }}><X size={18}/></button></div><input autoFocus value={text} onChange={e => { setText(e.target.value); setError('') }} placeholder="Например: подготовить отчёт по проекту" aria-label="Текст задачи"/>{error && <p className="field-error">{error}</p>}<div className="add-form-footer"><button type="button" className="button button-light" onClick={() => { setOpen(false); setError('') }}>Отмена</button><button className="button button-dark" type="submit"><Plus size={16}/> Добавить задачу</button></div></form>
}
