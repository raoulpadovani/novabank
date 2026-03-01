const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { registerUser, loginUser } = require('./user'); // chemin relatif depuis back/
const { getDepensesByUser, createDepense, deleteDepense } = require('./depenses');
const { getTransactionsByUser, createTransaction, deleteTransaction, transferBetweenUsers } = require('./transactions');

// parser JSON avant les routes
// CORS pour permettre les requêtes depuis le front en dev
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../front/dist')));

app.get('/', (req, res) => {
  console.log('coucou plop');
  res.json({ message: 'NovaBank API OK' });
});

app.post('/register', (req, res) => {
  console.log('controller register');
  registerUser(req.body, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }
    // Générer un token simple (dans un vrai projet, utiliser JWT)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    res.status(201).json({ user, token });
  });
});

app.get('/login', (req, res) => {
  console.log('GET login - récupération infos utilisateur');
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'email requis en query param' });
  }
  // Récupère l'utilisateur sans vérifier le mot de passe
  const con = require('./data');
  con.query('SELECT id, nom, email FROM users WHERE email = ? LIMIT 1', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ user: results[0] });
  });
});

app.post('/login', (req, res) => {
  console.log('controller login');
  const { email, mot_de_passe } = req.body;
  loginUser(email, mot_de_passe, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    // Générer un token simple (dans un vrai projet, utiliser JWT)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    res.json({ user, token });
  });
});

app.delete('/login/:email', (req, res) => {
  console.log('DELETE login - suppression utilisateur');
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: 'email requis' });
  }
  const con = require('./data');
  con.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: result.affectedRows === 1 });
  });
});

app.get('/register', (req, res) => {
  console.log('GET register - liste tous les utilisateurs');
  const con = require('./data');
  con.query('SELECT id, nom, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ users: results });
  });
});

app.delete('/register/:email', (req, res) => {
  console.log('DELETE register - suppression utilisateur');
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: 'email requis' });
  }
  const con = require('./data');
  con.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: result.affectedRows === 1 });
  });
});

// Liste des dépenses pour un utilisateur (compatibilité)
app.get('/depenses', (req, res) => {
  const userId = parseInt(req.query.user_id, 10) || 1;
  getDepensesByUser(userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ depenses: rows });
  });
});

// Liste des transactions pour un utilisateur
app.get('/transactions', (req, res) => {
  const userId = parseInt(req.query.user_id, 10) || 1;
  getTransactionsByUser(userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ transactions: rows });
  });
});

// Créer une dépense (compatibilité)
app.post('/depenses', (req, res) => {
  const depense = req.body;
  createDepense(depense, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ depense: result });
  });
});

// Créer une transaction (revenu/dépense)
app.post('/transactions', (req, res) => {
  const tx = req.body;
  createTransaction(tx, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ transaction: result });
  });
});

// Supprimer une dépense (nécessite user_id pour vérification)
app.delete('/depenses/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userId = parseInt(req.query.user_id, 10);

  if (!userId) {
    return res.status(400).json({ error: 'user_id requis en query param' });
  }

  deleteDepense(id, userId, (err, result) => {
    if (err) return res.status(403).json({ error: err.message });
    res.json({ deleted: result.affectedRows === 1 });
  });
});

// Supprimer une transaction (nécessite user_id pour vérification)
app.delete('/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userId = parseInt(req.query.user_id, 10);

  if (!userId) {
    return res.status(400).json({ error: 'user_id requis en query param' });
  }

  deleteTransaction(id, userId, (err, result) => {
    if (err) return res.status(403).json({ error: err.message });
    res.json({ deleted: result.affectedRows === 1 });
  });
});

// Virement entre deux utilisateurs
app.post('/virements', (req, res) => {
  const { from_user, to_user, montant, titre, description, date_transaction, lieu } = req.body;
  transferBetweenUsers(parseInt(from_user, 10), parseInt(to_user, 10), parseFloat(montant), { titre, description, date_transaction, lieu }, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ virement: result });
  });
});

// Toutes les autres routes renvoient vers l'app React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


