export type TaskStatus = 'pending' | 'done' | 'undone'
export interface Task { id: string; text: string; date: string; status: TaskStatus; reason: string; reasonHistory: string[] }
export type Journal = Record<string, Task[]>
