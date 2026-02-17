# NovaBank Frontend

Interface web moderne pour la gestion budgétaire personnelle.

## 🚀 Démarrage rapide

### Installation des dépendances
```bash
npm install
```

### Lancement en mode développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` et vous serez automatiquement redirigé vers le formulaire d'inscription.

## 📋 Fonctionnalités

- ✅ **Inscription** : Créez un nouveau compte
- ✅ **Connexion** : Accédez à votre compte existant
- ✅ **Dashboard** : Vue d'ensemble de vos finances
  - Solde total
  - Budgets par catégorie (Loyer, Alimentaire, Shopping, Autre)
  - Dernières transactions
- ✅ **Gestion des transactions** : Ajoutez, visualisez vos revenus et dépenses
- ✅ **Paramètres** : Gérez votre profil

## 🎨 Technologies utilisées

- **React** 18.2
- **React Router** 7.10 (navigation)
- **Axios** (API HTTP)
- **Tailwind CSS** (styles)
- **Vite** (bundler)

## 📂 Structure du projet

```
src/
├── api/          # Client API (axios)
├── components/   # Composants réutilisables
├── context/      # Contextes React (Auth)
├── page/         # Pages de l'application
├── styles/       # Fichiers CSS
└── App.jsx       # Point d'entrée principal
```

## 🔐 Authentification

L'authentification utilise le localStorage pour sauvegarder :
- Le token JWT
- Les informations de l'utilisateur

## 📡 API Backend

L'application communique avec le backend sur `http://localhost:3000`

Endpoints utilisés :
- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /transactions` - Liste des transactions
- `POST /transactions` - Créer une transaction

## 🎯 Routes disponibles

- `/` → Redirige vers `/register`
- `/register` → Page d'inscription
- `/login` → Page de connexion
- `/dashboard` → Tableau de bord (protégé)
- `/transactions` → Gestion des transactions (protégé)
- `/settings` → Paramètres du compte (protégé)

## 💅 Design

- Interface moderne avec dégradés
- Responsive (mobile, tablette, desktop)
- Animations et transitions fluides
- Palette de couleurs : Bleu (#0ea5e9)
