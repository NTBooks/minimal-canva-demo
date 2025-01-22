import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
sqlite3.verbose();


const dbPath = './data/db.sqlite';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS auth (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        authtoken TEXT,
        usertoken TEXT,
        state TEXT NOT NULL,
        expires INTEGER NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS designs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        correlation_state TEXT NOT NULL,
        config TEXT NOT NULL,
        url_edit TEXT NOT NULL,
        url_view TEXT NOT NULL,
        expires INTEGER NOT NULL
    )`);
});

async function deleteExpiredRecords() {
    const currentTime = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM auth WHERE expires < ?`, [currentTime], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
async function addAuthRecord(user, token, state, expires) {
    await deleteExpiredRecords();
    await new Promise((resolve, reject) => {
        db.run(`DELETE FROM auth WHERE user = ?`, [user], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`INSERT INTO auth (user, authtoken, state, expires) VALUES (?, ?, ?, ?)`);
        stmt.run(user, token, state, expires, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
        stmt.finalize();
    });
}

async function queryAuthByUser(user) {
    await deleteExpiredRecords();
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM auth WHERE user = ? LIMIT 1`, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {

                if (rows.length === 0) {
                    resolve(null);
                }

                resolve(rows[0]);
            }
        });
    });
}

async function updateAuthToken(user, state, token) {
    await deleteExpiredRecords();
    return new Promise((resolve, reject) => {
        db.run(`UPDATE auth SET authtoken = ? WHERE user = ? AND state = ?`, [token, user, state], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

async function updateUserToken(user, token) {
    await deleteExpiredRecords();
    return new Promise((resolve, reject) => {
        db.run(`UPDATE auth SET usertoken = ? WHERE user = ?`, [token, user], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}
async function addDesignRecord(user, correlation_state, config, url_edit, url_view, expires) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`INSERT INTO designs (user, correlation_state, config, url_edit, url_view, expires) VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run(user, correlation_state, config, url_edit, url_view, expires, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
        stmt.finalize();
    });
}

async function updateDesignRecord(correlation_state, url_edit, url_view) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE designs SET url_edit = ?, url_view = ? WHERE correlation_state = ?`, [url_edit, url_view, correlation_state], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

async function queryDesignByUser(user) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM designs WHERE user = ?`, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


export {
    addAuthRecord,
    queryAuthByUser,
    updateAuthToken,
    updateUserToken,
    addDesignRecord,
    queryDesignByUser,
    updateDesignRecord
};