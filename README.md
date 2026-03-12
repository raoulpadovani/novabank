![NovaBank](https://img.shields.io/badge/NovaBank-Banking%20App-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-F29111?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

# 🏦 NovaBank - Application Bancaire Complète

Une plateforme bancaire moderne, sécurisée et intuitive construite avec **React** et **Node.js/Express**.

## 🌟 Caractéristiques Principales

### 💰 Dashboard Interactif
- **Solde en temps réel** avec affichage actualisé
- **Budgets intelligents** répartis par catégorie
- **Suivi automatique** des dépenses avec décrément automatique
- **Historique des transactions** avec filtrage
- **Statistiques financières** (dépenses totales, revenus, ratio d'épargne)

### 💸 Système de Virements
- **Interface intuitive** pour envoyer de l'argent
- **Gestion des bénéficiaires** (ajouter, modifier, supprimer)
- **Validation du solde** en temps réel
- **Frais bancaires** calculés automatiquement
- **Historique complet** des virements

### 👥 Gestion Avancée des Bénéficiaires
- Enregistrement avec **IBAN, BIC, Email, Téléphone**
- **Types de bénéficiaires** (externes ou internes)
- **Validation IBAN** intégrée
- **Modification et suppression** faciles

### 🔐 Sécurité Multi-Couche
- **Authentification 2FA** avec code 6 chiffres
- **Hachage des mots de passe** sécurisé (scrypt)
- **Changer de mot de passe** avec vérification
- **Gestion des préférences** de notifications
- **Profil utilisateur** protégé

## 📊 Budgets Prédéfinis

| Catégorie | Budget | Icône |
|-----------|--------|-------|
| Loyer | 700€ | 🏠 |
| Alimentaire | 300€ | 🛒 |
| Shopping | 300€ | 👔 |
| Autre | 200€ | 📦 |
| **Total** | **1500€** | - |

## 🏗️ Architecture Technique

### Tech Stack
```
Frontend:  React 18 + React Router + CSS3
Backend:   Node.js + Express.js
Database:  MySQL 8.0
Auth:      Crypto.js + 2FA
```

### Structure des Répertoires
```
novabank/
├── 📁 back/                    # Backend Node.js
│   ├── server.js              # Serveur principal
│   ├── user.js                # Gestion utilisateurs
│   ├── budgets.js             # Routes budgets
│   ├── beneficiaires.js       # Routes bénéficiaires
│   ├── virements.js           # Routes virements
│   ├── twofa.js               # Authentification 2FA
│   ├── transactions.js        # Routes transactions
│   ├── data.js                # Connexion MySQL
│   └── package.json
│
├── 📁 front/                  # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Dashboard.jsx/css
│   │   │   ├── TransfertForm.jsx/css
│   │   │   ├── BeneficiairesManager.jsx/css
│   │   │   └── AccountSettings.jsx/css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── 📄 gestion_budget_updated.sql
├── 📄 DOCUMENTATION.md
├── 📄 README.md
└── 📄 install.sh
```

## 🚀 Guide Installation Rapide

### 1️⃣ Prérequis
```bash
✓ Node.js v16+
✓ npm ou yarn
✓ MySQL 8.0+
✓ Git (optionnel)
```

### 2️⃣ Cloner/Télécharger le projet
```bash
cd novabank
```

### 3️⃣ Importer la Base de Données
```bash
mysql -u root -p
mysql> source gestion_budget_updated.sql
```

### 4️⃣ Installer les dépendances

**Backend:**
```bash
cd back
npm install
```

**Frontend:**
```bash
cd front
npm install
```

### 5️⃣ Démarrer l'Application

**Terminal 1 - Backend:**
```bash
cd back
npm start
# 🚀 Serveur sur http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd front
npm run dev
# 🚀 App sur http://localhost:5173
```

### 6️⃣ Accéder à l'Application
```
URL: http://localhost:5173
```

## 👤 Utilisateurs Test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| alice@example.com | (hachée) | Utilisateur |
| bob@example.com | (hachée) | Utilisateur |

## 📡 Routes API Principales

### Authentication
```
POST   /register              Créer un compte
POST   /login                 Se connecter
GET    /login?email=...       Récupérer infos
DELETE /login/:email          Supprimer compte
```

### Budgets
```
GET    /budgets?user_id={id}           Lister budgets
GET    /budgets/details/{user_id}      Détails budgets
POST   /budgets                        Créer budget
PUT    /budgets/{id}                   Modifier
DELETE /budgets/{id}                   Supprimer
```

### Solde
```
GET    /solde/{user_id}                Solde total
```

### Bénéficiaires
```
GET    /beneficiaires?user_id={id}     Lister
POST   /beneficiaires                  Ajouter
PUT    /beneficiaires/{id}             Modifier
DELETE /beneficiaires/{id}             Supprimer
```

### Virements
```
POST   /virements/creer                Créer virement
GET    /virements?user_id={id}         Historique
GET    /virements/{id}                 Détail
DELETE /virements/{id}                 Annuler
```

### 2FA
```
POST   /2fa/generate                   Générer code
POST   /2fa/verify                     Vérifier code
POST   /2fa/toggle                     Activer/Désactiver
GET    /2fa/status/{user_id}           État 2FA
```

## 🎨 Interface Utilisateur

### Thème Moderne
- **Dégradé primaire** : #667eea → #764ba2
- **Couleurs accent** : Vert (#27ae60), Rouge (#e74c3c), Orange (#f39c12)
- **Design responsive** : Mobile, Tablette, Desktop

### Composants Clés
1. **Navigation Bar** : Navigation simple et claire
2. **Dashboard** : Vue complète de la situation financière
3. **Formulaires** : Validation et feedback utilisateur
4. **Cartes** : Affichage modulaire des informations
5. **Modales** : Formulaires et confirmations

## 🔒 Sécurité

### ✅ Implémentée
- Hachage des mots de passe (crypto.scryptSync)
- Authentification 2FA
- CORS configuré
- Validation des données
- Vérification du solde

### 🔐 Recommandé en Production
```javascript
// TODO: En production, ajouter:
- JWT Tokens pour l'authentification
- HTTPS/SSL
- Rate limiting
- Logs d'audit
- Chiffrement SSL de base de données
- WAF (Web Application Firewall)
- Conformité RGPD/CCPA
```

## 🐛 Dépannage

### Backend ne démarre pas
```bash
# Port 3000 occupé?
lsof -i :3000
kill -9 <PID>

# Erreur MySQL?
mysql -u root -p
mysql> SHOW DATABASES;
```

### Frontend ne charge pas l'API
```bash
# Vérifiez CORS
curl -i http://localhost:3000

# Vérifiez si le backend est actif
netstat -an | grep 3000
```

### Base de données vide
```bash
mysql -u root -p < gestion_budget_updated.sql
mysql> USE gestion_budget;
mysql> SHOW TABLES;
```

## 📈 Améliorations Futures

- [ ] Export PDF des relevés
- [ ] Graphiques avancés (Chart.js)
- [ ] Notifications email/SMS
- [ ] Paiements récurrents
- [ ] Intégration Stripe/PayPal
- [ ] App mobile native
- [ ] Recherche avancée
- [ ] Analytics dashboard
- [ ] Support multis devises
- [ ] Conformité KYC/AML

## 📦 Dépendances

### Backend
```json
{
  "express": "^5.1.0",
  "mysql2": "^3.15.3",
  "cors": "^2.8.5"
}
```

### Frontend
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^7.10.0"
}
```

## 👨‍💻 Contribution

Les contributions sont bienvenues! Pour contribuer:

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.



## 🙏 Remerciements

- [React](https://react.dev)
- [Express.js](https://expressjs.com)
- [MySQL](https://www.mysql.com)
- Communauté open-source

---

**⭐ Si ce projet vous plaît, n'oubliez pas de lui donner une star!**

**Créé avec ❤️ pour une meilleure gestion financière personnelle** 🏦
