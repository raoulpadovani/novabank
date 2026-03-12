const con = require('./data');

function getTransactionsByUser(userId, cb) {
  const sql = `SELECT t.id, t.id_user, t.id_categorie, t.id_sous_categorie, t.titre, t.description, t.montant, t.date_transaction, t.lieu, t.date_creation, 
  c.nom AS categorie, c.type AS categorie_type, 
  sc.nom AS sous_categorie
  FROM transactions t
  JOIN categories c ON t.id_categorie = c.id
  LEFT JOIN sous_categories sc ON t.id_sous_categorie = sc.id
  WHERE t.id_user = ?
  ORDER BY t.date_transaction DESC`;
  con.query(sql, [userId], (err, results) => {
    if (err) return cb(err);
    cb(null, results);
  });
}

function createTransaction(tx, cb) {
  if (!tx || !tx.id_user || !tx.id_categorie || !tx.montant || !tx.date_transaction) {
    return cb(new Error('id_user, id_categorie, montant et date_transaction requis'));
  }

  const sql = `INSERT INTO transactions (id_user, id_categorie, id_sous_categorie, titre, description, montant, date_transaction, lieu, date_creation)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  const params = [
    tx.id_user,
    tx.id_categorie,
    tx.id_sous_categorie || null,
    tx.titre || null,
    tx.description || null,
    tx.montant,
    tx.date_transaction,
    tx.lieu || null,
  ];

  con.query(sql, params, (err, result) => {
    if (err) return cb(err);
    cb(null, { id: result.insertId, ...tx });
  });
}

function deleteTransaction(id, userId, cb) {
  if (!id) return cb(new Error('id requis'));
  if (!userId) return cb(new Error('userId requis'));

  const verifySql = 'SELECT id_user FROM transactions WHERE id = ? LIMIT 1';
  con.query(verifySql, [id], (err, results) => {
    if (err) return cb(err);
    if (!results || results.length === 0) return cb(new Error('Transaction non trouvée'));
    if (results[0].id_user !== userId) return cb(new Error('Vous ne pouvez supprimer que vos propres transactions'));

    const deleteSql = 'DELETE FROM transactions WHERE id = ? AND id_user = ?';
    con.query(deleteSql, [id, userId], (err, result) => {
      if (err) return cb(err);
      cb(null, result);
    });
  });
}

function transferBetweenUsers(fromUser, toUser, amount, options, cb) {
  if (!fromUser || !toUser) return cb(new Error('fromUser et toUser requis'));
  if (!amount || amount <= 0) return cb(new Error('amount requis et doit être > 0'));

  const CAT_DEPENSE = 2;
  const CAT_REVENU = 1;

  const soldeSql = 'SELECT solde FROM vue_solde WHERE user_id = ? LIMIT 1';
  con.query(soldeSql, [fromUser], (err, rows) => {
    if (err) return cb(err);
    const solde = (rows && rows[0]) ? parseFloat(rows[0].solde) : 0;
    if (solde < amount) return cb(new Error('Solde insuffisant'));

    con.getConnection((connErr, connection) => {
      if (connErr) return cb(connErr);

      connection.beginTransaction((txErr) => {
        if (txErr) {
          connection.release();
          return cb(txErr);
        }

        const now = options && options.date_transaction ? options.date_transaction : new Date();
        const sqlExp = `INSERT INTO transactions (id_user, id_categorie, id_sous_categorie, titre, description, montant, date_transaction, lieu, date_creation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const paramsExp = [fromUser, CAT_DEPENSE, null, options.titre || 'Virement sortant', options.description || `Virement vers ${toUser}`, amount, now, options.lieu || null];

        connection.query(sqlExp, paramsExp, (errExp, resultExp) => {
          if (errExp) {
            return connection.rollback(() => {
              connection.release();
              cb(errExp);
            });
          }

          const paramsDest = [toUser, CAT_REVENU, null, options.titre || 'Virement entrant', options.description || `Virement de ${fromUser}`, amount, now, options.lieu || null];
          connection.query(sqlExp, paramsDest, (errDest, resultDest) => {
            if (errDest) {
              return connection.rollback(() => {
                connection.release();
                cb(errDest);
              });
            }

            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  connection.release();
                  cb(commitErr);
                });
              }
              connection.release();
              cb(null, { debitId: resultExp.insertId, creditId: resultDest.insertId });
            });
          });
        });
      });
    });
  });
}

module.exports = { getTransactionsByUser, createTransaction, deleteTransaction, transferBetweenUsers };
