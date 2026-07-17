import { useEffect, useState } from 'react';
import type { Resource } from '../types';

export const ResourceList = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/resources');
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
    fetchResources();
  }, []);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div 
          key={resource.id} 
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
          <p className="text-xs text-slate-400 font-mono">ID: {resource.id.split('-')[0]}</p>
        </div>
      ))}
    </div>
  );
};
