const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User');
const { validateCookie } = require('./auth')


//GETS BACK ALL THE POSTS
// router.get('/', async (req, res) => {
//     try {
//         const follows = await Follow.find();
//         res.json(follows);
//     } catch (err) {
//         res.json({ message: err });
//     }
// });

//FOLLOWS SOMEONE
router.post('/', validateCookie, async (req, res) => {

    const userExist = await User.exists({ name: req.body.following });
    if (userExist) {

        const follow = new Follow({
            Following: req.body.following,
            UserID: res.locals.userid
        });

        try {
            const savedFollow = await follow.save()
            res.json(savedFollow)
        } catch (err) {
            res.json({ message: err });
        }
    } else {
        return res.status(400).send({ msg: 'User does not exist' })
    }
});


//GETS ALL FOLLOWINGS
router.get('/', validateCookie, async (req, res) => {
    try {
        const follow = await Follow.find({ UserID: res.locals.userid });
        res.json(follow);
    } catch (err) {
        res.json({ message: err });
    }
});

//UNFOLLOWS SOMEONE
router.delete('/:followId', async (req, res) => {
    try {
        const removedFollow = await Follow.remove({ Following: req.params.followId });
        res.json(removedFollow)
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;