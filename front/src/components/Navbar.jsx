import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  return (
    <NavbarInner />
  );
}

function NavbarInner() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:text-brand transition-colors">
            <span className="text-2xl">🏦</span>
            <span>NovaBank</span>
          </Link>
        </div>

        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        <div className="hidden md:flex items-center gap-6">
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
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
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

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
          {user && (
            <>
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <span className="text-gray-600">👤 {user.nom}</span>
              </div>
              <Link 
                className="text-gray-700 hover:text-brand font-medium transition-colors py-2" 
                to="/dashboard"
                onClick={closeMenu}
              >
                📊 Dashboard
              </Link>
              <Link 
                className="text-gray-700 hover:text-brand font-medium transition-colors py-2" 
                to="/transactions"
                onClick={closeMenu}
              >
                💳 Transactions
              </Link>
              <Link 
                className="text-gray-700 hover:text-brand font-medium transition-colors py-2" 
                to="/settings"
                onClick={closeMenu}
              >
                ⚙️ Paramètres
              </Link>
              <button 
                onClick={() => { logout(); closeMenu(); }} 
                className="mt-2 w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-medium hover:bg-gray-300 transition-colors text-center"
              >
                🚪 Déconnexion
              </button>
            </>
          )}
          {!user && (
            <>
              <Link 
                className="w-full rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-dark transition-colors shadow-sm text-center" 
                to="/login"
                onClick={closeMenu}
              >
                Connexion
              </Link>
              <Link 
                className="w-full rounded-lg border-2 border-brand px-5 py-3 text-sm font-medium text-brand hover:bg-brand hover:text-white transition-colors text-center" 
                to="/register"
                onClick={closeMenu}
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
