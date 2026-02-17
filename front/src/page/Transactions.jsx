import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import TransactionForm from "../components/TransactionForm";

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/transactions", { params: { user_id: user.id } });
      if (data?.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      setError("Erreur lors du chargement des transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction?")) return;

    try {
      await api.delete(`/transactions/${id}`, { params: { user_id: user.id } });
      setTransactions(transactions.filter((tx) => tx.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    }
  };

  const handleAddTransaction = () => {
    setShowForm(false);
    fetchTransactions();
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.categorie_type === filter;
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {error && <div className="mt-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-brand px-4 py-2 font-medium text-white"
        >
          {showForm ? "Annuler" : "+ Ajouter une transaction"}
        </button>

        <div className="flex gap-2">
          {["all", "revenu", "depense"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-3 py-2 ${
                filter === f ? "bg-brand text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {f === "all" ? "Toutes" : f === "revenu" ? "Revenus" : "Dépenses"}
            </button>
          ))}
        </div>
      </div>

      {showForm && <TransactionForm userId={user.id} onSuccess={handleAddTransaction} />}

      {loading ? (
        <div className="mt-6">Chargement...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">Aucune transaction</div>
      ) : (
        <div className="mt-6 divide-y rounded-xl bg-white shadow">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{tx.titre}</h3>
                <p className="text-xs text-gray-500">{tx.description}</p>
                <p className="text-xs text-gray-400">{new Date(tx.date_transaction).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-lg font-semibold ${
                    tx.categorie_type === "revenu" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {tx.categorie_type === "revenu" ? "+" : "-"} {parseFloat(tx.montant).toFixed(2)}€
                </div>
                <button
                  onClick={() => handleDeleteTransaction(tx.id)}
                  className="rounded bg-red-100 px-2 py-1 text-red-600 hover:bg-red-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
