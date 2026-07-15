import { useState } from 'react'


interface TaskFormProps {
    onAddTask: (title: string) => void
}

function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        onAddTask(title)
        setTitle('')
    }
    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <input
                type="text"
                placeholder="Wpisz zadanie..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
                Dodaj
            </button>
        </form>
    )
}

export default TaskForm