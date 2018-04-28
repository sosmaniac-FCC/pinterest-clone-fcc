module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET
    },
    twitter: {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.APP_URL + '/twitter/auth/callback'
    }
};