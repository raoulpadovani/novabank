import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Welcome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            🏦 NovaBank
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gérez vos finances simplement et efficacement
          </p>
          
          {!user ? (
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                to="/register"
                className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark"
              >
                S'inscrire
              </Link>
              <Link
                to="/login"
                className="rounded-lg border-2 border-brand px-6 py-3 font-medium text-brand hover:bg-blue-50"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                to="/dashboard"
                className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark"
              >
                Accéder au Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-3xl">📊</div>
            <h3 className="mt-4 font-semibold">Dashboard</h3>
            <p className="mt-2 text-sm text-gray-600">
              Suivi du solde et des budgets en temps réel
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-3xl">💳</div>
            <h3 className="mt-4 font-semibold">Transactions</h3>
            <p className="mt-2 text-sm text-gray-600">
              Enregistrez vos revenus et dépenses facilement
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-3xl">⚙️</div>
            <h3 className="mt-4 font-semibold">Paramètres</h3>
            <p className="mt-2 text-sm text-gray-600">
              Gérez votre profil et vos préférences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
