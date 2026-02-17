import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  return (
    <NavbarInner />
  );
}

function NavbarInner() {
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:text-brand transition-colors">
            <span className="text-2xl">🏦</span>
            <span>NovaBank</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {user && (
            <>
              <Link className="text-gray-700 hover:text-brand font-medium transition-colors" to="/dashboard">
                Dashboard
              </Link>
              <Link className="text-gray-700 hover:text-brand font-medium transition-colors" to="/transactions">
                Transactions
              </Link>
              <Link className="text-gray-700 hover:text-brand font-medium transition-colors" to="/settings">
                Paramètres
              </Link>
              <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">👤 {user.nom}</span>
                <button 
                  onClick={logout} 
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </>
          )}
          {!user && (
            <>
              <Link 
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors shadow-sm" 
                to="/login"
              >
                Connexion
              </Link>
              <Link 
                className="rounded-lg border-2 border-brand px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand hover:text-white transition-colors" 
                to="/register"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
