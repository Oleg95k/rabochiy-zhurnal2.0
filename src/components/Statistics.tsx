import { Check, Circle, CircleX, ListTodo } from 'lucide-react'
interface Props { total: number; done: number; undone: number; pending: number }
export function Statistics({ total, done, undone, pending }: Props) {
  const percent = total === 0 ? 0 : Math.round(done / total * 100)
  return <section className="stats-panel" aria-label="Статистика выполнения">
    <div className="stats-heading"><div><span className="section-eyebrow">ИТОГИ ДНЯ</span><h2>Прогресс задач</h2></div><div className="progress-number">{percent}<span>%</span></div></div>
    <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }}/></div>
    <div className="stat-grid"><div className="stat-item"><span className="stat-icon total"><ListTodo size={17}/></span><span className="stat-label">Всего</span><strong>{total}</strong></div><div className="stat-item"><span className="stat-icon done"><Check size={17}/></span><span className="stat-label">Выполнено</span><strong>{done}</strong></div><div className="stat-item"><span className="stat-icon undone"><CircleX size={17}/></span><span className="stat-label">Не выполнено</span><strong>{undone}</strong></div><div className="stat-item"><span className="stat-icon pending"><Circle size={17}/></span><span className="stat-label">Не отмечено</span><strong>{pending}</strong></div></div>
  </section>
}
