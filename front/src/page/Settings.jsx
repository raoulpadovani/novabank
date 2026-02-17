import { useState } from "react";
import api, { clearAuth } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({ nom: user?.nom || "" });
  const [passwordData, setPasswordData] = useState({ old: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.put(`/users/${user.id}`, {
        nom: formData.nom,
      });

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Profil mis à jour avec succès");
      }
    } catch (err) {
      setErrors({ profile: err.response?.data?.error || "Erreur serveur" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const validErrors = {};

    if (!passwordData.old) validErrors.old = "Ancien mot de passe requis";
    if (!passwordData.new) validErrors.new = "Nouveau mot de passe requis";
    if (passwordData.new !== passwordData.confirm) validErrors.confirm = "Les mots de passe ne correspondent pas";

    if (Object.keys(validErrors).length > 0) {
      setErrors(validErrors);
      return;
    }

    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      await api.post(`/users/${user.id}/change-password`, {
        old_password: passwordData.old,
        new_password: passwordData.new,
      });

      setSuccess("Mot de passe changé avec succès");
      setPasswordData({ old: "", new: "", confirm: "" });
    } catch (err) {
      setErrors({ password: err.response?.data?.error || "Erreur serveur" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr? Cette action est irréversible.")) return;

    try {
      await api.delete(`/users/${user.id}`);
      clearAuth();
      logout();
    } catch (err) {
      setErrors({ delete: err.response?.data?.error || "Erreur lors de la suppression" });
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {success && <div className="mt-4 rounded bg-emerald-100 p-3 text-emerald-700">{success}</div>}

      {/* Profile Section */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">Informations du compte</h2>
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-gray-500"
            />
          </div>
          {errors.profile && <p className="text-xs text-red-600">{errors.profile}</p>}
         
        </form>
      </div>

     
      {/* Danger Zone */}
      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-600">Zone de danger</h2>
        <p className="mt-2 text-sm text-gray-600">Ces actions sont irréversibles</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={logout}
            className="rounded bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            Déconnexion
          </button>
          <button
            onClick={handleDeleteAccount}
            className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Supprimer le compte
          </button>
        </div>
        {errors.delete && <p className="mt-2 text-xs text-red-600">{errors.delete}</p>}
      </div>
    </div>
  );
}
