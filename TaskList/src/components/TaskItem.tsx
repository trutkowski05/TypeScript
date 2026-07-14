import { Task } from '../types/task'

interface TaskItemProps {
    task: Task
    onToggle: (id: string) => void
    onRemove: (id: string) => void
}

function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
    return (
        <div>
            <input
                type="checkbox"
                onChange={() => onToggle(task.id)}
                checked={task.isCompleted}
            />
            <span>{task.title}</span>
            <button onClick={() => onRemove(task.id)}>Usuń</button>
        </div>
    )
}

export default TaskItem
