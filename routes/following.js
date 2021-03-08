const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');



//GETS BACK ALL THE POSTS
router.get('/', async (req, res) => {
    try {
        const follows = await Follow.find();
        res.json(follows);
    } catch (err) {
        res.json({ message: err });
    }
});

//SUBMITS A POST
router.post('/', async (req, res) => {
    const follow = new Follow({
        following: req.body.following,
        Username: req.body.Username
    });

    try {
        const savedFollow = await follow.save()
        res.json(savedFollow)
    } catch (err) {
        res.json({ message: err });
    }
});


//SPECIFIC POST
router.get('/:followId', async (req, res) => {
    try {
        const follow = await Follow.findById(req.params.followId);
        res.json(follow);
    } catch (err) {
        res.json({ message: err });
    }
});

//Delete specific post
router.delete('/:followId', async (req, res) => {
    try {
        const removedFollow = await Follow.remove({ _id: req.params.followId });
        res.json(removedFollow)
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;