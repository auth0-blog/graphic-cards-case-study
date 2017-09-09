function login(email, password, callback) {
    "use strict";
    const request = require('request-promise@1.0.2');
    const Promise = require('bluebird@3.4.6');

    const authenticate = Promise.coroutine(function *() {
        const getTokenOptions = {
            method: 'POST',
            url: 'https://bkrebs.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
            body: '{"client_id":"BvEdrxK2T2f36Hnttintbe4yIEjUC5P2", "client_secret":"13rf3mN0ciOEckabpE4TF4LYstBfOa19DYUBED7-MMzEM-CjR2ig_kifTfyy3Hoh","audience":"legacy-idp","grant_type":"client_credentials"}'
        };

        // gets an access token to communicate with the legacy identity resources
        const tokenResponse = yield request(getTokenOptions);
        const accessToken = JSON.parse(tokenResponse).access_token;

        //gets the user profile from the both application
        let profileApp1 = {};
        let profileApp2 = {};
        try {
            profileApp1 = JSON.parse(yield legacyAuth(accessToken, 'http://node-app-1.tk/users/authenticate'));
        } catch (e) { }

        try {
            profileApp2 = JSON.parse(yield legacyAuth(accessToken, 'http://node-app-2.tk/users/authenticate'));
        } catch (e) { }

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