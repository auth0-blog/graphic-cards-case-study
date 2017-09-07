function login(email, password, callback) {
    const request = require('request-promise@1.0.2');

    let userApp1;
    let accessToken;

    const getTokenOptions = {
        method: 'POST',
        url: 'https://bkrebs.auth0.com/oauth/token',
        headers: {'content-type': 'application/json'},
        body: '{"client_id":"3qu4Cxt4h2x9Em7Cj0s7Zg5FxhQLjiiK","client_secret":"sUOIf4Psed68nU4hZvHlkRE2vCgUJF4UHlymKOJrgpn6oL8NJ3bOvdA1Y4ajo3IW","audience":"http://sample-app/","grant_type":"client_credentials"}'
    };

    request(getTokenOptions).then(function (body) {

        accessToken = JSON.parse(body).access_token;
        return authenticate('http://node-app-1.tk/users/authenticate');

    }).then(function (body) {

        userApp1 = JSON.parse(body);

        return authenticate('http://node-app-2.tk/users/authenticate');

    }).then(function (body) {

        const userApp2 = JSON.parse(body);

        Object.keys(userApp1).forEach((key) => (userApp1[key] === null) && delete userApp1[key]);
        Object.keys(userApp2).forEach((key) => (userApp2[key] === null) && delete userApp2[key]);

        const profile = Object.assign({}, userApp2, userApp1);
        profile.email = email;

        return callback(null, profile);

    }).catch(function (err) {

        if (err.message) {
            console.log(err.message);
            return callback(new WrongUsernameOrPasswordError(email, err.message));
        }

        console.log(err);
        return callback(new Error(err));
    });

    function authenticate(url) {
        const authApp1Options = {
            method: 'POST',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'content-type': 'application/json'
            },
            body: '{ "username": "' + email + '", "password": "' + password + '" }'
        };
        return request(authApp1Options);
    }
}