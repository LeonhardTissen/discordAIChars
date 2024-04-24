import sqlite3 from 'sqlite3';

// Database setup
const db = new sqlite3.Database('database.db');

db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS models (idname TEXT UNIQUE, displayname, model TEXT, owner TEXT, profile TEXT)');
});

export async function getAllModels() {
	return new Promise((resolve, reject) => {
		db.all('SELECT * FROM models', (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

export async function getModel(idName) {
	return new Promise((resolve, reject) => {
		db.get('SELECT * FROM models WHERE idname = ? COLLATE NOCASE', [idName], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
}

export async function getRandomModel() {
	return new Promise((resolve, reject) => {
		db.get('SELECT * FROM models ORDER BY RANDOM() LIMIT 1', (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
}

export async function updateField(idName, field, value) {
	return new Promise((resolve, reject) => {
		db.run(`UPDATE models SET ${field} = ? WHERE idname = ? COLLATE NOCASE`, [value, idName], (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function deleteModel(idName) {
	return new Promise((resolve, reject) => {
		db.run('DELETE FROM models WHERE idname = ? COLLATE NOCASE', [idName], (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function addModel(idName, displayName, prompt, owner, profile) {
	return new Promise((resolve, reject) => {
		db.run('INSERT INTO models (idname, displayname, model, owner, profile) VALUES (?, ?, ?, ?, ?)', [idName, displayName, prompt, owner, profile], (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
