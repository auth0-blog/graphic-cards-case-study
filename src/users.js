const mysql = require('./mysql');
const router = require('express').Router();

router.get('/', (req, res) => {
    mysql().query('select * from users').then((rows) => {
        res.send(rows);
    });
});

router.get('/:id', (req, res) => {
    res.send({ id: 1, name: 'Bruno Krebs' });
});

module.exports = router;
