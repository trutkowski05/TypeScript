import { Task } from '../types/task'

const STORAGE_KEY = 'tasklist-tasks'


export function loadTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY)

    if (data) {
        const parsedData = JSON.parse(data)
        return parsedData
    } else {
        return []
    }
}

export function saveTasks(tasks: Task[]): void {
    const savedData = JSON.stringify(tasks)
    localStorage.setItem(STORAGE_KEY, savedData)
}
