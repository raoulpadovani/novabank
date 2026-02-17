const mysql = require('mysql2');

// Use a pool to avoid "closed state" errors when the single connection drops
const pool = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	// WAMP a souvent un mot de passe vide par défaut ; surcharge via DB_PASSWORD si besoin
	password: process.env.DB_PASSWORD || 'root',
	port: process.env.DB_PORT || 3306,
	database: process.env.DB_NAME || 'gestion_budget',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.error('MySQL connection error:', err);
	} else {
		console.log('Connected to MySQL database gestion_budget');
		connection.release();
	}
});

module.exports = pool;


