import sqlite3 from 'sqlite3';

// Database setup
const db = new sqlite3.Database('database.db');

db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS models (idname TEXT UNIQUE, displayname, model TEXT, owner TEXT, profile TEXT)');
});

/*
 * Run a query on the database
 * @param {string} verb - The type of query to run (get, all, run)
 * @param {string} query - The SQL query to run
 * @param {Array} params - The parameters to pass to the query
 * @returns {Promise} - A promise that resolves with the result of the query
 * @throws {Error} - If an invalid verb is passed
 * @private
 */
function runQuery(verb, query, params = []) {
	if (![ 'get', 'all', 'run' ].includes(verb)) throw new Error('Invalid verb');

	return new Promise((resolve, reject) => {
		db[verb](query, params, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

export async function getAllModels() {
	return runQuery('all', 'SELECT * FROM models');
}

export async function getModel(idName) {
	return runQuery('get', 'SELECT * FROM models WHERE idname = ? COLLATE NOCASE', [idName]);
}

export async function getRandomModel() {
	return runQuery('get', 'SELECT * FROM models ORDER BY RANDOM() LIMIT 1');
}

export async function updateField(idName, field, value) {
	return runQuery('run', `UPDATE models SET ${field} = ? WHERE idname = ? COLLATE NOCASE`, [value, idName]);
}

export async function deleteModel(idName) {
	return runQuery('run', 'DELETE FROM models WHERE idname = ? COLLATE NOCASE', [idName]);
}

export async function addModel(idName, displayName, prompt, owner, profile) {
	return runQuery('run', 'INSERT INTO models (idname, displayname, model, owner, profile) VALUES (?, ?, ?, ?, ?)', [idName, displayName, prompt, owner, profile]);
}
