const mysql = require('promise-mysql');
const express = require('express');
const util = require('util');
const timeout = util.promisify(setTimeout);

const app = express();

const mysqlProps = {
    host: process.env.MYSQL_HOST || '192.168.0.20',
    user: process.env.MYSQL_USER || 'app-mysql',
    database: process.env.MYSQL_DATABASE || 'node-1',
    password: process.env.MYSQL_PASSWORD || 'mysecretpassword'
};

console.log(mysqlProps);

timeout(10000)
    .then(mysql.createConnection(mysqlProps))
    .then(() => {
        app.listen(3000, function () {
            console.log(`Example app listening on port ${process.env.NODE_PORT}!`);
        });

        app.get('/', function (req, res) {
            console.log('got a request');
            res.send('Hello World!')
        });
    }).catch((error) => {
        console.log(error);
    });