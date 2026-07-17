import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:3001/api/bookings'

const SERVICES = [
  'Masaż',
  'Fryzjer',
  'Kosmetyczka',
  'Trening Personalny'
]

interface Booking {
  id: string
  clientName: string
  service: string
  date: string
  time: string
}

interface ServiceStats {
  service: string
  count: number
  percentage: number
}

interface Stats {
  totalBookings: number
  services: ServiceStats[]
}

function App() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [clientName, setClientName] = useState('')
  const [service, setService] = useState(SERVICES[0])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('08:00')

  const [filterDate, setFilterDate] = useState('')

  const fetchBookings = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filterDate) {
        queryParams.append('date', filterDate)
      }
      const url = queryParams.toString() ? `${API_BASE}?${queryParams.toString()}` : API_BASE

      const response = await fetch(url)
      if (!response.ok) throw new Error('Nie udało się pobrać rezerwacji')
      const data = await response.json()
      setBookings(data)
    } catch (err: any) {
      setError(err.message || 'Błąd połączenia')
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`)
      if (!response.ok) throw new Error('Nie udało się pobrać statystyk')
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchBookings()
    fetchStats()
  }, [filterDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (clientName.trim() === '') {
      setError('Imię i nazwisko klienta są wymagane!')
      return
    }

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, service, date, time })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Błąd zapisu')
      }

      setClientName('')
      
      await fetchBookings()
      await fetchStats()
    } catch (err: any) {
      setError(err.message || 'Błąd dodawania rezerwacji')
    }
  };

  const handleDelete = async (id: string) => {
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Błąd usuwania')
      }

      await fetchBookings()
      await fetchStats()
    } catch (err: any) {
      setError(err.message || 'Błąd usuwania rezerwacji')
    }
  };
  // 1. Ekran ładowania (Guard Clause)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-indigo-500"></span>
        </span>
      </div>
    )
  }

  // 2. Główny pulpit aplikacji
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* NAGŁÓWEK */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            System Rezerwacji Wizyt
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Zarządzaj rezerwacjami i analizuj popularność usług</p>
        </header>

        {/* BANER BŁĘDU */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between transition-all">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-red-400 hover:text-red-200 font-bold px-2 text-xl cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        {/* UKŁAD SIATKI (3 KOLUMNY) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEWA KOLUMNA (FORMULARZ I STATYSTYKI) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* KARTA FORMULARZA */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-indigo-400 border-b border-slate-800 pb-2">Zarezerwuj wizytę</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Imię i Nazwisko klienta
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="np. Jan Kowalski"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Usługa
                  </label>
                  <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {SERVICES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Data wizyty
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Godzina
                  </label>
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Zarezerwuj
                </button>

              </form>
            </div>

            {/* KARTA STATYSTYK */}
            {stats && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h2 className="text-xl font-bold mb-4 text-emerald-400 border-b border-slate-800 pb-2">Statystyki salonu</h2>
                
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Łączna liczba wizyt</p>
                  <p className="text-3xl font-extrabold text-slate-100">{stats.totalBookings}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Popularność usług</h3>
                  {stats.services.length === 0 ? (
                    <div className="text-sm text-slate-500">Brak rezerwacji do statystyk</div>
                  ) : (
                    <div className="space-y-4">
                      {stats.services.map(s => {
                        const maxCount = Math.max(...stats.services.map(x => x.count))
                        const barWidth = maxCount > 0 ? (s.count / maxCount) * 100 : 0
                        
                        return (
                          <div key={s.service} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300 font-medium">{s.service}</span>
                              <span className="text-slate-400">{s.count} wizyt ({s.percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${barWidth}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* PRAWA KOLUMNA (FILTRY I LISTA REZERWACJI) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FILTRY */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-purple-400 border-b border-slate-800 pb-2">Filtruj terminarz</h2>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Wybierz dzień
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                {filterDate && (
                  <button 
                    onClick={() => setFilterDate('')}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-200 transition-all cursor-pointer"
                  >
                    Wyczyść filtr
                  </button>
                )}
              </div>
            </div>

            {/* TABELA REZERWACJI */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-pink-400 border-b border-slate-800 pb-2">Terminarz wizyt</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium">
                  Brak rezerwacji w wybranym terminie
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Godzina</th>
                        <th className="py-3 px-4">Klient</th>
                        <th className="py-3 px-4">Usługa</th>
                        <th className="py-3 px-4">Data</th>
                        <th className="py-3 px-4 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-4 font-bold text-indigo-400">{b.time}</td>
                          <td className="py-4 px-4 text-slate-200 font-semibold">{b.clientName}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                              {b.service}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-400 text-sm">{b.date}</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="text-red-400 hover:text-red-300 font-bold transition-all cursor-pointer"
                            >
                              Anuluj
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
export default App

