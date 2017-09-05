const app = require('./src/server');
const users = require('./src/users');

app.use('/users', users);

app.listen(3000, function () {
    console.log(`Example app listening on port ${process.env.NODE_PORT}!`);
});