const mysql = require('./mysql');
const router = require('express').Router();

router.get('/', (req, res) => {
    mysql().query('select * from users').then((rows) => {
        res.send(rows);
    });
});

router.get('/:id', (req, res) => {
    const query = 'select * from users where id = ? limit 1';
    const { id } = req.params;
    mysql().query(query, [id]).then((users) => {
        if (users.length === 0) {
            res.status(404);
            res.send({ message: 'User not found' });
        }
        res.send(users[0]);
    });
});

router.post('/authenticate', (req, res) => {
    const query = 'select * from users where username = ? and password = ? limit 1';
    const { username, password } = req.body;
    mysql().query(query, [username, password]).then((users) => {
        if (users.length === 0) {
            res.status(404);
            res.send({ message: 'User not found' });
        }
        res.send(users[0]);
    });
});

module.exports = router;
