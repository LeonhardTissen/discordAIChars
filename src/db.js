import sqlite3 from 'sqlite3';

// Database setup
export const db = new sqlite3.Database('database.db');

db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS models (idname TEXT UNIQUE, displayname, model TEXT, owner TEXT, profile TEXT)');
});
