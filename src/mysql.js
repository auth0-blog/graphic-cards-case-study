const mysql = require('promise-mysql');
const util = require('util');
const timeout = util.promisify(setTimeout);

let connection = null;

const mysqlProps = {
    host: process.env.MYSQL_HOST || '192.168.0.20',
    user: process.env.MYSQL_USER || 'app-mysql',
    database: process.env.MYSQL_DATABASE || 'node-1',
    password: process.env.MYSQL_PASSWORD || 'mysecretpassword'
};

function connect() {
    mysql.createConnection(mysqlProps).then((conn) => {
        console.log('connected');
        connection = conn;
        return connection.query('show tables');
    }).then((rows) => {
        if (rows.length === 0) {
            return connection.query(`
                create table users (
                     id mediumint not null auto_increment,
                     name char(30) not null,
                     primary key (id)
                );
            `);
        }
    }).catch((error) => {
        console.error(error);
        console.log('wait 5 second before retrying');
        timeout(5000).then(connect);
    });
}

connect();

module.exports = function() {
    return connection;
};