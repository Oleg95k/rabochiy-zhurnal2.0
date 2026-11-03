import { useEffect, useState } from 'react'
import type { Journal, Task } from '../types'
const STORAGE_KEY = 'work-journal-v1'
function readJournal(): Journal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return parsed as Journal
  } catch { return {} }
}
export function useJournal() {
  const [journal, setJournal] = useState<Journal>(readJournal)
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(journal)) }, [journal])
  function updateDay(date: string, updater: (tasks: Task[]) => Task[]) {
    setJournal(current => ({ ...current, [date]: updater(current[date] ?? []) }))
  }
  return { journal, updateDay }
}
