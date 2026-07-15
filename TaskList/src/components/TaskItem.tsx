import type { Task } from '../types/task'

interface TaskItemProps {
    task: Task
    onToggle: (id: string) => void
    onRemove: (id: string) => void
}

function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-500 cursor-pointer rounded"
                    onChange={() => onToggle(task.id)}
                    checked={task.isCompleted}
                />
                <span className={`text-lg ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {task.title}
                </span>
            </div>
            <button
                onClick={() => onRemove(task.id)}
                className="px-3 py-1 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded transition-colors"
            >
                Usuń
            </button>
        </div>
    )
}

export default TaskItem
