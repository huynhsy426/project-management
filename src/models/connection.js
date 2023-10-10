
const dbConfig = require("../config/configDB");
const bluebird = require('bluebird');

// create the connection, specify bluebird as Promise
// const connection = mysql.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB,
//     Promise: bluebird
// });

const mySQLConnection = {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
};





// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'test',
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//   idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0
// });

module.exports = mySQLConnection;