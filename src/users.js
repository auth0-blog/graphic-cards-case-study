const mysql = require('./mysql');

module.exports = {
    get: [
        { path: '/users', handler: getUsers },
        { path: '/users/:userId', handler: getUserById }
    ]
};

const users = [
    { id: 1, name: 'Bruno Krebs' },
    { id: 2, name: 'Maria da Silva' }
];

function getUsers(req, res) {
    mysql().query('select * from users').then((rows) => {
        res.send(rows);
    });
}

function getUserById(req, res) {
    res.send(users[0]);
}
