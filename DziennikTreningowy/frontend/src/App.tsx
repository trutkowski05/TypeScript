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
}

export default App