import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", mot_de_passe: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/login", formData);
      if (!data?.token || !data?.user) {
        setError("Réponse invalide du serveur");
        return;
      }
      login({ token: data.token, user: data.user });
    } catch (err) {
      setError(err?.response?.data?.error || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-3xl">
              🏦
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">NovaBank</h1>
            <h2 className="mt-2 text-lg text-gray-600">Connexion</h2>
          </div>
          
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="jean.dupont@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="mot_de_passe"
                placeholder="••••••••"
                value={formData.mot_de_passe}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary mt-6">
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <a className="font-medium text-brand hover:text-brand-dark transition-colors" href="/register">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
