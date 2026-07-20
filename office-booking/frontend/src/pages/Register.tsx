import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate(); 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(''); 
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Wystąpił błąd podczas rejestracji');
      }

      setSuccess(true);
      
      // Po 2 sekundach przenosimy użytkownika na stronę logowania
      setTimeout(() => {
          navigate('/login');
      }, 2000);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            OB
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Załóż konto</h2>
          <p className="text-slate-500 mt-2">Dołącz do naszego nowoczesnego biura</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-lg text-sm text-center font-medium">
            Konto zostało pomyślnie utworzone! Przenoszenie do logowania...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Adres e-mail</label>
            <input 
              type="email" 
              required
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="np. nowy@biuro.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hasło</label>
            <input 
              type="password" 
              required
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 transition-colors shadow-sm"
          >
            Zarejestruj się
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Masz już konto?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  );
};
