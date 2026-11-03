export function toDateKey(date: Date) {
  const year = date.getFullYear(), month = String(date.getMonth() + 1).padStart(2, '0'), day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
export function shiftDate(date: string, amount: number) {
  const [year, month, day] = date.split('-').map(Number)
  const result = new Date(year, month - 1, day + amount)
  return toDateKey(result)
}
export function formatDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(year, month - 1, day))
}
