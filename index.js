const app = require('./src/server');
const users = require('./src/users');

if (users.get) {
    users.get.forEach((endpoint) => {
        app.get(endpoint.path, endpoint.handler);
    });
}

app.listen(3000, function () {
    console.log(`Example app listening on port ${process.env.NODE_PORT}!`);
});