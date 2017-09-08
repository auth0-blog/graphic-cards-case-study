const mysql = require('./mysql');
const router = require('express').Router();

router.get('/', (req, res) => {
    console.log('getting users');
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

router.get('/:email', (req, res) => {
    const query = 'select * from users where email = ? limit 1';
    const { email } = req.params;
    mysql().query(query, [email]).then((users) => {
        if (users.length === 0) {
            res.status(404);
            res.send({ message: 'User not found' });
        }
        res.send(users[0]);
    });
});

router.post('/authenticate', (req, res) => {
    const query = 'select * from users where email = ? and password = ? limit 1';
    const { email, password } = req.body;
    mysql().query(query, [email, password]).then((users) => {
        if (users.length === 0) {
            res.status(404);
            res.send({ message: 'User not found' });
        }
        res.send(users[0]);
    });
});

module.exports = router;
