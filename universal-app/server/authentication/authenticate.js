const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../models/User');
const config = require('../server.config.js');

passport.serializeUser((user, done) => {
    // req.session.passport.user
    done(null, user.id);
});
    
passport.deserializeUser((id, done) => {
    // req.user
    User.findById(id, (err, user) => {
        done(err, user); 
    });
});

const localOpts = {
    usernameField: 'login-username',
    passwordField: 'login-password'
};

exports.local = passport.use(new LocalStrategy(localOpts, (username, password, callback) => {
    User.findOne({ username: username }, (error, user) => {
        if (error)
            return callback(error, false);
        
        if (user) {
            new Promise((res, rej) => User.comparePassword(res, rej, password, user.pwdHash))
            .then((equal) => {
                if (equal) {
                    return callback(null, user);
                }
                else {
                    return callback(null, false);
                }
            });
        }
        else {
            return callback(null, false);
        }
    });
}));

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
};

exports.jwt = passport.use(new JwtStrategy(jwtOpts, (jwtPayload, callback) => {
    User.findOne({ id: jwtPayload.id }, (error, user) => {
        if (error) 
            return callback(error, false);
        else if (user) 
            return callback(null, user);
        else 
            return callback(null, false);
    });
}));

// Social media integration
const twitterOpts = {
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
};

exports.twitter = passport.use(new TwitterStrategy(twitterOpts, (token, tokenSecret, profile, callback) => {
    User.findOne({twitterId: profile.id}, (error, user) => {
        if (error) 
            return callback(error, false);
        else if (user) 
            return callback(null, user);
        else { 
            let newUser = new User();
            
            newUser.username = profile.username;
            newUser.email = 'https://twitter.com/' + profile.username;
            newUser.pwdHash = null;
            newUser.twitterId = profile.id;
            
            newUser.save((error) => {
                if (error) throw error;
                
                return callback(null, newUser);
            });
        }
    });
}));

// this function assigns isAuthenticated to the req body prior to the rest of the route logic
exports.verifyUser = (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
        if (error || !user) {
            req.isAuthenticated = false;
            next();
        }
        else {
            req.isAuthenticated = true;
            next();
        }
    })(req, res, next);
};