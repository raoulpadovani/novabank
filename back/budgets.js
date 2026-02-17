const con = require('./data');

// Default budget allocation for user_id=1
const DEFAULT_BUDGETS = {
	loyer: 700,
	alimentaire: 300,
	autre: 200,
	shopping: 300,
};

// Create table if missing
con.query(
	`CREATE TABLE IF NOT EXISTS budgets (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		category VARCHAR(50) NOT NULL,
		allocated DECIMAL(10,2) NOT NULL DEFAULT 0,
		spent DECIMAL(10,2) NOT NULL DEFAULT 0,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY unique_user_cat (user_id, category)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	(err) => {
		if (err) console.error('Erreur creation table budgets:', err.message || err);
	}
);

function ensureDefaultBudgets(userId, cb) {
	const entries = Object.entries(DEFAULT_BUDGETS);
	const values = entries.map(([cat, amount]) => [userId, cat, amount, 0]);
	const sql =
		'INSERT IGNORE INTO budgets (user_id, category, allocated, spent) VALUES ?';
	con.query(sql, [values], (err) => {
		if (err) return cb(err);
		cb();
	});
}

function getBudgets(userId, cb) {
	ensureDefaultBudgets(userId, (seedErr) => {
		if (seedErr) return cb(seedErr);
		const sql = 'SELECT id, user_id, category, allocated, spent, (allocated - spent) AS remaining FROM budgets WHERE user_id = ? ORDER BY category';
		con.query(sql, [userId], (err, rows) => {
			if (err) return cb(err);
			cb(null, rows);
		});
	});
}

function resetBudgets(userId, cb) {
	const entries = Object.entries(DEFAULT_BUDGETS);
	const updates = entries.map(([cat, amount]) => [amount, 0, userId, cat]);
	const sql = 'INSERT INTO budgets (allocated, spent, user_id, category) VALUES ? ON DUPLICATE KEY UPDATE allocated = VALUES(allocated), spent = VALUES(spent)';
	con.query(sql, [updates], (err) => {
		if (err) return cb(err);
		cb();
	});
}

function updateBudgetExpense(userId, category, amount, cb) {
	if (!category) return cb();
	ensureDefaultBudgets(userId, (seedErr) => {
		if (seedErr) return cb(seedErr);
		const sql = 'UPDATE budgets SET spent = spent + ? WHERE user_id = ? AND category = ?';
		con.query(sql, [amount, userId, category], (err) => {
			if (err) return cb(err);
			cb();
		});
	});
}

module.exports = { getBudgets, resetBudgets, updateBudgetExpense, DEFAULT_BUDGETS };