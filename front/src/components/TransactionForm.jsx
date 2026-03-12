import { useState, useEffect } from "react";
import api from "../api/client";

export default function TransactionForm({ userId, onSuccess }) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    montant: "",
    date_transaction: new Date().toISOString().split("T")[0],
    categorie_type: "depense",
    id_categorie: 2,
    id_sous_categorie: "",
    lieu: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.montant || parseFloat(formData.montant) <= 0) newErrors.montant = "Le montant doit être positif";
    if (!formData.date_transaction) newErrors.date_transaction = "La date est requise";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "categorie_type") {
      const newIdCategorie = value === "revenu" ? 1 : 2;
      setFormData({ 
        ...formData, 
        [name]: value,
        id_categorie: newIdCategorie 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id_user: userId,
        titre: formData.titre,
        description: formData.description,
        montant: parseFloat(formData.montant),
        date_transaction: formData.date_transaction,
        id_categorie: parseInt(formData.id_categorie),
        id_sous_categorie: formData.id_sous_categorie ? parseInt(formData.id_sous_categorie) : null,
        lieu: formData.lieu,
      };
      
      const { data } = await api.post("/transactions", payload);

      if (!data) throw new Error("Erreur lors de la création");

      setFormData({
        titre: "",
        description: "",
        montant: "",
        date_transaction: new Date().toISOString().split("T")[0],
        categorie_type: "depense",
        id_categorie: 2,
        id_sous_categorie: "",
        lieu: "",
      });
      setErrors({});
      onSuccess();
    } catch (err) {
      setErrors({ api: err.response?.data?.error || "Erreur serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Ajouter une transaction</h2>
      {errors.api && <div className="mt-3 rounded bg-red-100 p-2 text-red-700">{errors.api}</div>}
      
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre *</label>
          <input
            type="text"
            name="titre"
            placeholder="Ex: Épicerie"
            value={formData.titre}
            onChange={handleChange}
            className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${
              errors.titre ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-brand"
            }`}
          />
          {errors.titre && <p className="text-xs text-red-600">{errors.titre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Détails (optionnel)"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant (€) *</label>
            <input
              type="number"
              name="montant"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.montant}
              onChange={handleChange}
              className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${
                errors.montant ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-brand"
              }`}
            />
            {errors.montant && <p className="text-xs text-red-600">{errors.montant}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              name="date_transaction"
              value={formData.date_transaction}
              onChange={handleChange}
              className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${
                errors.date_transaction ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-brand"
              }`}
            />
            {errors.date_transaction && <p className="text-xs text-red-600">{errors.date_transaction}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type *</label>
            <select
              name="categorie_type"
              value={formData.categorie_type}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="depense">Dépense</option>
              <option value="revenu">Revenu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sous-catégorie</label>
            <select
              name="id_sous_categorie"
              value={formData.id_sous_categorie}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">-- Sélectionner --</option>
              {formData.categorie_type === "revenu" ? (
                <>
                  <option value="1">Salaire</option>
                  <option value="4">Autre revenu</option>
                </>
              ) : (
                <>
                  <option value="2">Alimentation</option>
                  <option value="3">Logement</option>
                  <option value="6">Shopping</option>
                  <option value="7">Autre</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lieu</label>
          <input
            type="text"
            name="lieu"
            placeholder="Où? (optionnel)"
            value={formData.lieu}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
