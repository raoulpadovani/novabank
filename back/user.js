const con = require('./data');
const crypto = require('crypto');

/*module de connexion*/
function hashmot_de_passe(mot_de_passe) {
	const salt = crypto.randomBytes(16).toString('hex');
	const derivedKey = crypto.scryptSync(mot_de_passe, salt, 64).toString('hex');
	return `${salt}:${derivedKey}`;
}

function verifymot_de_passe(mot_de_passe, stored) {
	if (!stored) return false;
	const [salt, key] = stored.split(':');
	const derived = crypto.scryptSync(mot_de_passe, salt, 64).toString('hex');
	return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derived, 'hex'));
}

/**
 * registerUser
 * @param {{nom: string, email: string, mot_de_passe: string}} user
 * @param {(err: Error|null, result?: object)=>void} cb
 */
function registerUser(user, cb) {
    console.log("coucou debut")
	if (!user || !user.nom || !user.email || !user.mot_de_passe) {
		return cb(new Error('nom, email and mot_de_passe are required'));
	}

	const hashed = hashmot_de_passe(user.mot_de_passe);

	// attention: il manquait une parenthèse fermante après la liste des colonnes
	const sql = 'INSERT INTO users (nom, email, mot_de_passe, date_creation) VALUES (?, ?, ?, NOW())';
	console.log('coucou erreur')
    con.query(sql, [user.nom, user.email, hashed], (err, result) => {
		if (err) return cb(err);
		cb(null, { id: result.insertId, nom: user.nom, email: user.email });
	});
}

/**
 * loginUser
 * @param {string} email
 * @param {string} mot_de_passe
 * @param {(err: Error|null, user?: object)=>void} cb
 */
function loginUser(email, mot_de_passe, cb) {
	if (!email || !mot_de_passe) return cb(new Error('email and mot_de_passe are required'));

	const sql = 'SELECT id, nom, email, mot_de_passe FROM users WHERE email = ? LIMIT 1';
	con.query(sql, [email], (err, results) => {
		if (err) return cb(err);
		if (!results || results.length === 0) return cb(new Error('Utilisateur non trouvé'));

		const row = results[0];
		const stored = row.mot_de_passe;
		try {
			const ok = verifymot_de_passe(mot_de_passe, stored);
			if (!ok) return cb(new Error('Mot de passe incorrect'));
			// Ne renvoie pas le hash de mot de passe
			const user = { id: row.id, nom: row.nom, email: row.email };
			return cb(null, user);
		} catch (e) {
			return cb(e);
		}
	});
}

module.exports = { registerUser, loginUser, hashmot_de_passe, verifymot_de_passe };




