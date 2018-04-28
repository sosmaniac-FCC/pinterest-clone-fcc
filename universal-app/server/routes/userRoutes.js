const authenticate = require('../authentication/authenticate.js');
const config = require('../server.config.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const passport = require('passport');

const router = express.Router();

router.get('/twitter/auth', passport.authenticate('twitter'));

router.get('/twitter/auth/callback', passport.authenticate('twitter', {
    successRedirect: '/pins-all', successFlash: 'Successfully logged in.', 
    failureRedirect: '/login', failureFlash: 'Authentication through Twitter failed. Please try again.'
}));

router.post('/loginUser', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            throw err;
        else if (user) 
            res.send({ userId: user.username, token: jwt.sign(user.toJSON(), config.jwt.secret) });
        else 
            res.send({ failureMsg: 'Account username/password are incorrect. Please try again.' }); 
    })(req, res, next);
});

router.post('/registerUser', (req, res) => {
    new Promise((res, rej) => User.encrypt(res, rej, req.body['account-password']))
    .then((hash) => User.create({
        username: req.body['account-username'],
        email: req.body['account-email'],
        pwdHash: hash,
        twitterId: null
    })).then(() => {
        res.end();  
    }).catch((error) => {
        console.error(error);
        
        res.send({ failureMsg: 'Account username/email have already been taken. Please try another.'});
    });
});

router.get('/authenticateUser', (req, res, next) => authenticate.verifyUser(req, res, next), (req, res) => {
    if (req.isAuthenticated) {
        res.send(true);
    }
    else {
        res.send(false);
    }
});

router.get('/logoutUser', (req, res) => {
    req.logout();
    
    res.end();
});

module.exports = router;