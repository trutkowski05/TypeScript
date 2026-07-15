import type { Task } from '../types/task'
import TaskItem from './TaskItem'

interface TaskListProps {
    tasks: Task[]
    onToggle: (id: string) => void
    onRemove: (id: string) => void
}

function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                Brak zadań na liście! Dodaj coś powyżej.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {tasks.map(task =>
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onRemove={onRemove} >
                </TaskItem>)}
        </div>
    )
}

export default TaskList
