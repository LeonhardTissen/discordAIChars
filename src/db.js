import sqlite3 from 'sqlite3';

// Database setup
export const db = new sqlite3.Database('database.db');

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
		db.get('SELECT * FROM models WHERE idname = ?', [idName], (err, row) => {
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
		db.run(`UPDATE models SET ${field} = ? WHERE idname = ?`, [value, idName], (err) => {
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
		db.run('DELETE FROM models WHERE idname = ?', [idName], (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
