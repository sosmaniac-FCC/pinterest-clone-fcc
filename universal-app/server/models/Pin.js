const mongoose = require('mongoose');

const PinSchema = mongoose.Schema({
    imgURL: {
        type: String
    },
    title: {
        type: String
    },
    likes: {
        type: Number,
        required: true
    },
    likers: {
        type: Array  
    },
    posterId: {
        type: String,
        required: true
    }
});

const Pin = mongoose.model('Pin', PinSchema);

module.exports = Pin;