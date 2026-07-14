import { useState } from 'react'


interface TaskFormProps {
    onAddTask: (title: string) => void
}

function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddTask(title)
        setTitle('')
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Wpisz zadanie..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Dodaj</button>
        </form>
    )
}

export default TaskForm