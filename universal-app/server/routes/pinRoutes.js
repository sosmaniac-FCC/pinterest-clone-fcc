const express = require('express');
const Pin = require('../models/Pin.js');

const router = express.Router();

router.get('/fetchPins', (req, res) => {
    Pin.find(req.query.id ? { posterId: req.query.id } : {})
    .then((results) => {
        res.send(results);
    }).catch((error) => {
        console.error(error);
        
        res.send({ failureMsg: 'Pin search failed. Please try again.' });
    });
});

router.post('/createPin', (req, res) => {
    const information = req.body;
    
    Pin.create({ 
        imgURL: information['pin-url'],
        title: information['pin-title'],
        likes: 0,
        likers: [],
        posterId: information.userId
    }).then((result) => {
        res.send({ pin: result });
    }).catch((error) => {
        console.error(error);
        
        res.send({ failureMsg: 'Pin creation failed. Please try again.' }); 
    });
});

router.put('/toggleLikes', (req, res) => {
    Pin.findOne({ _id: req.body.pinId })
    .then((pin) => {
        if (pin) {
            if (pin.likers.includes(req.body.userId)) {
                pin.likers.splice(pin.likers.indexOf(req.body.userId), 1);
                pin.likes--;
                pin.markModified('likers');
                pin.markModified('likes');
                
                pin.save().then(() => {
                    res.send({ result: -1 }); 
                }).catch((error) => {
                    throw error;
                });
            }
            else {
                pin.likers.push(req.body.userId);
                pin.likes++;
                pin.markModified('likers');
                pin.markModified('likes');
                
                pin.save().then(() => {
                    res.send({ result: 1 }); 
                }).catch((error) => {
                    throw error;
                });
            }
        }
        else {
            res.send({ failureMsg: 'Unable to find pin. Please try again.' });
        }
    }).catch((error) => {
        console.error(error);
        
        res.send({ failureMsg: 'Internal server error. Please try again.' });
    });
});

router.delete('/deletePin', (req, res) => {
    Pin.remove({ _id: req.query.id })
    .then((result) => {
        res.send({ _id: req.query.id });
    }).catch((error) => {
        console.error(error);
        
        res.send({ failureMsg: 'Pin deletion failed. Please try again.' });
    });
});

module.exports = router;