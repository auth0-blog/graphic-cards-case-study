function getByEmail(email, callback) {
    "use strict";
    const request = require('request-promise@1.0.2');
    const Promise = require('bluebird@3.4.6');

    const fetchProfile = Promise.coroutine(function *() {
        const getTokenOptions = {
            method: 'POST',
            url: 'https://bkrebs.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
            body: '{"client_id":"3qu4Cxt4h2x9Em7Cj0s7Zg5FxhQLjiiK", "client_secret":"sUOIf4Psed68nU4hZvHlkRE2vCgUJF4UHlymKOJrgpn6oL8NJ3bOvdA1Y4ajo3IW","audience":"legacy-idp","grant_type":"client_credentials"}'
        };

        // gets an access token to communicate with the legacy identity resources
        const tokenResponse = yield request(getTokenOptions);
        const accessToken = JSON.parse(tokenResponse).access_token;

        //gets the user profile from the both application
        let profileApp1 = null;
        let profileApp2 = null;
        try {
            profileApp1 = JSON.parse(yield findByEmail(accessToken, 'http://node-app-1.tk/users/'));
        } catch (e) { }

        try {
            profileApp2 = JSON.parse(yield findByEmail(accessToken, 'http://node-app-2.tk/users/'));
        } catch (e) { }

        // no profiles found?
        if (profileApp1 === null && profileApp2 === null) {
            return callback(null);
        }

        profileApp1 = profileApp1 || {};
        profileApp2 = profileApp2 || {};

        // removes null properties from both profile to make merge (assign) unaware of them
        Object.keys(profileApp1).forEach((key) => (profileApp1[key] === null) && delete profileApp1[key]);
        Object.keys(profileApp2).forEach((key) => (profileApp2[key] === null) && delete profileApp2[key]);

        // merges both profiles
        const profile = Object.assign({}, profileApp1, profileApp2, { email });
        return callback(null, profile);
    });

    fetchProfile().catch(function(e) {
        return callback(new Error(e));
    });

    function findByEmail(accessToken, url) {
        const options = {
            method: 'GET',
            url: url + email,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'content-type': 'application/json'
            },
        };
        return request(options);
    }
}