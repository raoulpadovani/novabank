const con = require('./data');

function getDepensesByUser(userId, cb) {
  const sql = `SELECT t.id, t.id_user, t.id_categorie, t.id_sous_categorie, t.titre, t.description, t.montant, t.date_transaction, t.lieu, t.date_creation, c.nom AS categorie, sc.nom AS sous_categorie
  FROM transactions t
  JOIN categories c ON t.id_categorie = c.id
  LEFT JOIN sous_categories sc ON t.id_sous_categorie = sc.id
  WHERE t.id_user = ? AND c.type = 'depense'
  ORDER BY t.date_transaction DESC`;
  con.query(sql, [userId], (err, results) => {
    if (err) return cb(err);
    cb(null, results);
  });
}

function createDepense(depense, cb) {
  if (!depense || !depense.id_user || !depense.id_categorie || !depense.montant || !depense.date_transaction) {
    return cb(new Error('id_user, id_categorie, montant et date_transaction requis'));
  }

  const sql = `INSERT INTO transactions (id_user, id_categorie, id_sous_categorie, titre, description, montant, date_transaction, lieu, date_creation)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  const params = [
    depense.id_user,
    depense.id_categorie,
    depense.id_sous_categorie || null,
    depense.titre || null,
    depense.description || null,
    depense.montant,
    depense.date_transaction,
    depense.lieu || null,
  ];

  con.query(sql, params, (err, result) => {
    if (err) return cb(err);
    cb(null, { id: result.insertId, ...depense });
  });
}

function deleteDepense(id, userId, cb) {
  if (!id) return cb(new Error('id requis'));
  if (!userId) return cb(new Error('userId requis'));
  
  const verifySql = 'SELECT id_user FROM transactions WHERE id = ? LIMIT 1';
  con.query(verifySql, [id], (err, results) => {
    if (err) return cb(err);
    if (!results || results.length === 0) return cb(new Error('Dépense non trouvée'));
    
    if (results[0].id_user !== userId) {
      return cb(new Error('Vous ne pouvez supprimer que vos propres dépenses'));
    }
    
    const deleteSql = 'DELETE FROM transactions WHERE id = ? AND id_user = ?';
    con.query(deleteSql, [id, userId], (err, result) => {
      if (err) return cb(err);
      cb(null, result);
    });
  });
}

module.exports = { getDepensesByUser, createDepense, deleteDepense };
