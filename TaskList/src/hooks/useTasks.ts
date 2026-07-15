import { useState } from 'react'
import type { Task, Filter } from '../types/task'
import { loadTasks, saveTasks } from '../utils/storage'

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(loadTasks())
    const [filter, setFilter] = useState<Filter>('all')

    const addTask = (title: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: title,
            isCompleted: false,
            createdAt: new Date().toISOString()

        }
        setTasks([...tasks, newTask])
        saveTasks([...tasks, newTask])
    }

    const removeTask = (id: string) => {
        const updatedTasks = tasks.filter(t => t.id !== id)
        setTasks(updatedTasks)
        saveTasks(updatedTasks)
    }

    const toggleTask = (id: string) => {
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
        setTasks(updatedTasks)
        saveTasks(updatedTasks)
    }

    return { tasks, filter, setFilter, addTask, removeTask, toggleTask }
}
