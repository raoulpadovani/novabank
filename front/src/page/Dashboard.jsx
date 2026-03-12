import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import BudgetPieChart from "../components/BudgetPieChart.jsx";

const BUDGETS = {
  loyer: { montant: 700, label: "Loyer", icon: "🏠" },
  alimentaire: { montant: 300, label: "Alimentaire", icon: "🍔" },
  shopping: { montant: 300, label: "Shopping", icon: "🛍️" },
  autre: { montant: 200, label: "Autre", icon: "📦" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [solde, setSolde] = useState(0);
  const [budgets, setBudgets] = useState(BUDGETS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user.id]);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/transactions`, { params: { user_id: user.id } });
      
      if (data?.transactions) {
        setTransactions(data.transactions);
        calculateBalance(data.transactions);
        calculateBudgets(data.transactions);
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalance = (txs) => {
    const total = txs.reduce((acc, tx) => {
      return tx.categorie_type === "revenu" ? acc + parseFloat(tx.montant) : acc - parseFloat(tx.montant);
    }, 0);
    setSolde(total);
  };

  const calculateBudgets = (txs) => {
    const newBudgets = {
      loyer: { ...BUDGETS.loyer },
      alimentaire: { ...BUDGETS.alimentaire },
      shopping: { ...BUDGETS.shopping },
      autre: { ...BUDGETS.autre },
    };

    txs.forEach((tx) => {
      const categorie = tx.sous_categorie?.toLowerCase() || "";

      if (tx.categorie_type === "depense") {
        if (categorie.includes("loyer") || categorie.includes("logement")) {
          newBudgets.loyer.depense =
            (newBudgets.loyer.depense || 0) + parseFloat(tx.montant);
        } else if (categorie.includes("alimentation") || categorie.includes("courses")) {
          newBudgets.alimentaire.depense =
            (newBudgets.alimentaire.depense || 0) + parseFloat(tx.montant);
        } else if (categorie.includes("shopping")) {
          newBudgets.shopping.depense =
            (newBudgets.shopping.depense || 0) + parseFloat(tx.montant);
        } else {
          newBudgets.autre.depense =
            (newBudgets.autre.depense || 0) + parseFloat(tx.montant);
        }
      }
    });

    setBudgets(newBudgets);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.nom} 👋
          </h1>
          <p className="mt-1 text-gray-600">Voici un aperçu de vos finances</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-brand to-cyan-600 p-8 shadow-xl text-white">
          <h2 className="text-lg font-medium opacity-90">Solde Total</h2>
          <div className="mt-2 text-5xl font-bold">
            {solde.toFixed(2)}€
          </div>
          <p className="mt-2 text-sm opacity-80">
            {solde >= 0 ? "Vous êtes en bonne santé financière" : "Attention à vos dépenses"}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Budgets</h2>
          
          <div id="cam" className="hidden md:block mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des budgets</h3>
            <BudgetPieChart budgets={budgets} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(budgets).map(([key, budget]) => {
              const depense = budget.depense || 0;
              const reste = budget.montant - depense;
              const pourcentage = (depense / budget.montant) * 100;

              return (
                <div key={key} className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{budget.icon}</span>
                    <h3 className="font-semibold text-gray-900">{budget.label}</h3>
                  </div>
                  <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        pourcentage > 100 ? 'bg-red-500' : pourcentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(pourcentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {depense.toFixed(2)}€ / {budget.montant}€
                    </span>
                    <span className={`font-semibold ${reste >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {reste.toFixed(2)}€
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dernières Transactions</h2>
          <div className="rounded-xl bg-white shadow-lg overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Aucune transaction pour le moment</p>
              </div>
            ) : (
              <div className="divide-y">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{tx.titre}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.date_transaction).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${tx.categorie_type === "revenu" ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.categorie_type === "revenu" ? "+" : "-"} {parseFloat(tx.montant).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
