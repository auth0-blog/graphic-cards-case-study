const router = require('express').Router();
const users = require(`../db/${process.env.MYSQL_DATABASE || 'node-1'}-users`);

router.get('/', (req, res) => {
    console.log('getting users');
    res.send(users);
});

router.get('/:email', (req, res) => {
    const { email } = req.params;
    let userFound = false;
    users.forEach((user) => {
        if (user.email === email) {
            res.send(users[0]);
            userFound = true;
        }
    });
    if (!userFound) {
        res.status(404);
        res.send({ message: 'User not found' });
    }
});

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    let userFound = false;
    users.forEach((user) => {
        if (user.email === email && user.password === password) {
            res.send(users[0]);
            userFound = true;
        }
    });
    if (!userFound) {
        res.status(404);
        res.send({message: 'User not found'});
    }
});

module.exports = router;
