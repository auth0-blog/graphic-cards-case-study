function login(email, password, callback) {
    const request = require('request-promise@1.0.2');
    const Promise = require('bluebird@3.4.6');

    const authenticate = Promise.coroutine(function *() {
        const getTokenOptions = {
            method: 'POST',
            url: 'https://bkrebs.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
            body: '{"client_id":"3qu4Cxt4h2x9Em7Cj0s7Zg5FxhQLjiiK", "client_secret":"sUOIf4Psed68nU4hZvHlkRE2vCgUJF4UHlymKOJrgpn6oL8NJ3bOvdA1Y4ajo3IW","audience":"http://sample-app/","grant_type":"client_credentials"}'
        };

        // gets an access token to communicate with the legacy identity resources
        const tokenResponse = yield request(getTokenOptions);
        const accessToken = JSON.parse(tokenResponse).access_token;

        //gets the user profile from the first application
        const authApp1Response = yield legacyAuth(accessToken, 'http://node-app-1.tk/users/authenticate');
        const profileApp1 = JSON.parse(authApp1Response);

        //gets the user profile from the second application
        const authApp2Response = yield legacyAuth(accessToken, 'http://node-app-2.tk/users/authenticate');
        const profileApp2 = JSON.parse(authApp2Response);

        // removes null properties from both profile to make merge (assign) unaware of them
        Object.keys(profileApp1).forEach((key) => (profileApp1[key] === null) && delete profileApp1[key]);
        Object.keys(profileApp2).forEach((key) => (profileApp2[key] === null) && delete profileApp2[key]);

        // merges both profiles
        const profile = Object.assign({}, profileApp1, profileApp2, { email });
        return callback(null, profile);
    });

    authenticate().catch(function(e) {
        return callback(new Error(e));
    });

    function legacyAuth(accessToken, url) {
        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'content-type': 'application/json'
            },
            body: '{ "email": "' + email + '", "password": "' + password + '" }'
        };
        return request(options);
    }
}