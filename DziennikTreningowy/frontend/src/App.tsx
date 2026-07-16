import React, { useState, useEffect } from 'react'

interface Workout {
  id: string,
  duration: number,
  activity: string,
  notes: string,
  date: string
}

interface ActivityStats {
  activity: string,
  sum: number,
  percentage: number
}

interface WorkoutStatistics {
  totalDuration: number,
  activities: ActivityStats[]
}

const API_BASE = "http://localhost:3001/api/treningi"

const ACTIVITIES = [
  "Bieganie",
  "Siłownia",
  "Rower",
  "Pływanie",
  "Joga"
]

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [stats, setStats] = useState<WorkoutStatistics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [duration, setDuration] = useState<string>("")
  const [activity, setActivity] = useState<string>(ACTIVITIES[0])
  const [notes, setNotes] = useState<string>("")
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])

  const [from, setFrom] = useState<string>("")
  const [to, setTo] = useState<string>("")

  const fetchWorkouts = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (from) {
        queryParams.append('from', from)
      }

      if (to) {
        queryParams.append('to', to)
      }

      const url = queryParams.toString() ? API_BASE + '?' + queryParams.toString() : API_BASE
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych')
      }

      const data = await response.json()
      setWorkouts(data)
    }

    catch (err: any) {
      setError(err.message || 'Błąd połączenia')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(API_BASE + '/statistics')

      if (!response.ok) {
        throw new Error('Błąd pobierania statystyk')
      }

      const data = await response.json()
      setStats(data)
    }

    catch (err: any) {
      setError(err.message || 'Błąd połączenia')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchWorkouts()
      await fetchStats()
      setLoading(false)
    }
    loadData()
  }, [])
  useEffect(() => {
    fetchWorkouts()
  }, [from, to])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const parsedDuration = parseInt(duration)

    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setError('Czas trwania musi być liczbą dodatnią!')
      return
    }

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: parsedDuration, activity, notes, date })
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Błąd zapisu!')
      }

      setDuration('')
      setNotes('')

      await fetchWorkouts()
      await fetchStats()
    }
    catch (err: any) {
      setError(err.message || 'Błąd dodawania')

    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(API_BASE + '/' + id, { method: 'DELETE' })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Błąd zapisu!')
      }
      await fetchWorkouts()
      await fetchStats()
    }

    catch (err: any) {
      setError(err.message || 'Błąd usuwania')
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
        </span>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className='text-center'>
          <h1 className='text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Dziennik Treningowy</h1>
          <p className='text-slate-400 mt-2 font-medium'>Śledź swoje postępy i analizuj statystyki</p>
        </header>
        {error && (
          <div className='bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between'>
            {error}
            <button className="text-red-400 hover:text-red-200 font-bold px-2 text-xl"
              onClick={() => setError(null)}
            >
              x
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-400 border-b border-slate-800 pb-2">Dodaj trening</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Aktywność
                </label>
                <select
                  value={activity}
                  onChange={e => setActivity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {ACTIVITIES.map(act => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Czas trwania (minuty)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="np. 45"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App