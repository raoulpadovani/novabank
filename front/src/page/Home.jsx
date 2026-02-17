import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home({ user }) {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="welcome-section">
          <h1>Bienvenue, <span className="user-name">{user?.nom}</span> ! 👋</h1>
          <p className="subtitle">Gérez votre budget avec NovaBank</p>
        </div>

        <div className="home-content">
          <div className="info-box">
            <h2>📊 Votre compte</h2>
            <p><strong>Nom :</strong> {user?.nom}</p>
            <p><strong>Email :</strong> {user?.email}</p>
            <p><strong>ID :</strong> {user?.id}</p>
          </div>

          <div className="actions-grid">
            <button 
              className="action-btn dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              <span className="icon">📈</span>
              <span>Tableau de bord</span>
            </button>
            
            <button 
              className="action-btn transactions-btn"
              onClick={() => navigate("/transactions")}
            >
              <span className="icon">💳</span>
              <span>Transactions</span>
            </button>
            
            <button 
              className="action-btn settings-btn"
              onClick={() => navigate("/settings")}
            >
              <span className="icon">⚙️</span>
              <span>Paramètres</span>
            </button>
          </div>
        </div>

        <div className="footer-text">
          <p>Commencez par explorer votre tableau de bord pour voir vos transactions récentes.</p>
        </div>
      </div>
    </div>
  );
}
