const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    // XOR the following two fields
    pwdHash: {
        type: String
    },
    twitterId: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.encrypt = (resolve, reject, string) => {
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return reject(error);
        
        bcrypt.hash(string, salt, (error, hash) => {
            if (error) return reject(error);
            
            return resolve(hash); 
        });
    });
};

module.exports.comparePassword = (resolve, reject, candidate, hash) => {
    bcrypt.compare(candidate, hash, (error, isMatch) => {
        if (error) return reject(error);
        
        return resolve(isMatch);
    });
};