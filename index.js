const app = require('./src/server');
const users = require('./src/users');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

console.log(process.env.app);
process.env.app = process.env.app || 'node-1';
console.log(process.env.app);

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://bkrebs.auth0.com/.well-known/jwks.json"
    }),
    audience: 'legacy-idp',
    issuer: "https://bkrebs.auth0.com/",
    algorithms: ['RS256']
});

app.use(jwtCheck);

app.use((req, res, next) => {
    let requiredScope = null;
    if (process.env.app === 'node-1') {
        requiredScope = "authenticate:app1";
    } else {
        requiredScope = "authenticate:app2";
    }
    if (!req.user || !req.user.scope || !req.user.scope.indexOf(requiredScope)) {
        res.sendStatus(401);
        return;
    }
    next();
});

app.use('/users', users);

app.listen(3000, function () {
    console.log(`Example app listening on port ${process.env.NODE_PORT}!`);
});