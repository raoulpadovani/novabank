const con = require('./data');

con.query(
	`CREATE TABLE IF NOT EXISTS beneficiaires (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		nom VARCHAR(150) NOT NULL,
		iban VARCHAR(34) NOT NULL,
		alias VARCHAR(100),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		UNIQUE KEY unique_user_iban (user_id, iban)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	(err) => {
		if (err) console.error('Erreur creation table beneficiaires:', err.message || err);
	}
);

function listBeneficiaires(userId, cb) {
	const sql = 'SELECT id, user_id, nom, iban, alias, created_at FROM beneficiaires WHERE user_id = ? ORDER BY created_at DESC';
	con.query(sql, [userId], (err, rows) => {
		if (err) return cb(err);
		cb(null, rows);
	});
}

function addBeneficiaire(data, cb) {
	if (!data || !data.user_id || !data.nom || !data.iban) {
		return cb(new Error('user_id, nom et iban requis'));
	}
	const sql = 'INSERT INTO beneficiaires (user_id, nom, iban, alias) VALUES (?, ?, ?, ?)';
	con.query(sql, [data.user_id, data.nom, data.iban, data.alias || null], (err, result) => {
		if (err) return cb(err);
		cb(null, { id: result.insertId, ...data });
	});
}

function deleteBeneficiaire(id, userId, cb) {
	const sql = 'DELETE FROM beneficiaires WHERE id = ? AND user_id = ?';
	con.query(sql, [id, userId], (err, result) => {
		if (err) return cb(err);
		cb(null, result);
	});
}

module.exports = { listBeneficiaires, addBeneficiaire, deleteBeneficiaire };