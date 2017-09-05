const mysql = require('./mysql');
const router = require('express').Router();

router.get('/', (req, res) => {
    mysql().query('select * from users').then((rows) => {
        res.send(rows);
    });
});

router.get('/:id', (req, res) => {
    mysql().query(`select * from users where id = ${req.params.id} limit 1`).then((users) => {
        if (users.length === 0) {
            res.status(404);
            res.send({ message: 'User not found' });
        }
        res.send(users[0]);
    });
});

module.exports = router;
