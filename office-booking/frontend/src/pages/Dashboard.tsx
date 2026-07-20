import { ResourceList } from '../components/ResourceList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            OB
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Office Booking
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-sm">
            Zalogowano jako: <span className="font-semibold text-indigo-600">{user?.email}</span>
            <span className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-medium">
              {user?.role}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            Wyloguj się
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Zarządzaj swoją przestrzenią
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            Witaj w nowoczesnym systemie rezerwacji. Znajdź idealne biurko lub salę na dzisiejsze spotkania.
          </p>
        </div>

        <ResourceList />
      </main>
    </div>
  );
};
