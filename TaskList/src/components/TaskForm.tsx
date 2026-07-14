interface TaskFormProps {
    onAddTask: (title: string) => void
}

function TaskForm({ onAddTask }: TaskFormProps) {
    return (
        <form>
            <input type="text" placeholder="Wpisz zadanie..." />
            <button type="submit">Dodaj</button>
        </form>
    )
}

export default TaskForm