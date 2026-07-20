import { useEffect, useState } from 'react';
import type { Resource } from '../types';
import { useAuth } from '../context/AuthContext';

export const ResourceList = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const { token, user } = useAuth();

  const handleBooking = async (resourceId: string) => {
    if (!selectedDate) {
      alert("Najpierw wybierz datę z kalendarza!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/bookings', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resourceId: resourceId, 
          userId: user?.id, 
          date: selectedDate
        })
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Nie udało się zarezerwować biurka");
      }

      alert("SUKCES! " + json.message);
      
      await fetchResources();
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("BŁĄD: " + err.message);
      }
    }
  };

  const fetchResources = async () => {
    try {
      const url = selectedDate 
        ? `http://localhost:3000/api/v1/resources?date=${selectedDate}` 
        : 'http://localhost:3000/api/v1/resources';
        
      const response = await fetch(url);
      if (!response.ok) throw new Error('Nie udało się pobrać danych z serwera');
      
      const json = await response.json();
      setResources(json.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Wystąpił błąd');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedDate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-indigo-200 rounded-full"></div>
          <p className="text-slate-500 font-medium">Ładowanie biurek...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 font-medium">Wystąpił problem: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <label className="font-semibold text-slate-700">Wybierz datę rezerwacji:</label>
        <input 
          type="date" 
          className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div 
            key={resource.id} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                resource.type === 'DESK' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}>
                {resource.type === 'DESK' ? 'Biurko' : 'Pokój'}
              </span>
              
              <span className={`flex items-center gap-1.5 text-sm font-medium ${
                resource.isActive ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${resource.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                {resource.isActive ? 'Dostępne' : 'Niedostępne'}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-1">{resource.name}</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">ID: {resource.id.split('-')[0]}</p>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <button 
                onClick={() => handleBooking(resource.id)} 
                disabled={!resource.isActive || resource.isBooked} 
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  resource.isBooked 
                  ? 'bg-red-100 text-red-500 cursor-not-allowed'
                  : resource.isActive 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {resource.isBooked 
                  ? 'Zarezerwowane na ten dzień' 
                  : resource.isActive 
                    ? 'Zarezerwuj to miejsce' 
                    : 'Niedostępne'}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
