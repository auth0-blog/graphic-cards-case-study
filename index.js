const app = require('./src/server');
const users = require('./src/users');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://bkrebs.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://sample-app/',
    issuer: "https://bkrebs.auth0.com/",
    algorithms: ['RS256']
});

app.use(jwtCheck);

app.use('/users', users);

app.listen(3000, function () {
    console.log(`Example app listening on port ${process.env.NODE_PORT}!`);
});