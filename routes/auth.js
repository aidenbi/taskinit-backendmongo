const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {
    //validate
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //check user if already in database
    const nameExist = await User.findOne({ name: req.body.name });
    if (nameExist) return res.status(400).send('Name already exists');

    //hash pasword
    const salt = await bcrypt.gentSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //create a new user
    const user = new User({
        name: req.body.name,
        password: hashPassword
    });
    try {
        const savedUser = await user.save()
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});


//login
router.post('/login', async (req, res) => {
    //validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //check if name exists
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(400).send('Name or password is wrong');
    //pass is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Name or password is wrong')


    //create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);



});
module.exports = router;