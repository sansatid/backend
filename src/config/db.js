const mysql = require('mysql');

const db = mysql.createConnection({
    host: '5.189.153.72',
    user: 'wannabedev',
    password: '12345678',
    database: 'wbd_db',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

module.exports = db;