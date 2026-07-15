import { useTasks } from "./hooks/useTasks"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"


function App() {
  const { tasks, filter, setFilter, addTask, removeTask, toggleTask } = useTasks()

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.isCompleted
    if (filter === 'completed') return t.isCompleted
    return true
  })

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400">Lista Zadań</h1>
      <TaskForm onAddTask={addTask} />
      
      <div className="flex gap-4 my-6 justify-center">
        <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Wszystkie</button>
        <button onClick={() => setFilter('active')} className={`px-4 py-1 rounded transition-colors ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Do zrobienia</button>
        <button onClick={() => setFilter('completed')} className={`px-4 py-1 rounded transition-colors ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Zakończone</button>
      </div>

      <TaskList tasks={filteredTasks} onToggle={toggleTask} onRemove={removeTask} />
    </div>
  )
}

export default App