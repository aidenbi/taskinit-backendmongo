const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');





function validateCookie(req, res, next) {
    const cookies = req.cookies;

    console.log(cookies)
    if ('session_id' in cookies) {
        try {
            const userid = jwt.verify(cookies.session_id, process.env.TOKEN_SECRET)._id
            console.log(userid)
            res.locals.userid = userid
            next();
        } catch {
            res.status(403).send({ msg: 'Not Authenticated' })
        }

    } else {
        res.status(403).send({ msg: 'Not Authenticated' })
    }
}
router.post('/register', async (req, res) => {
    //validate
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //check user if already in database
    const nameExist = await User.findOne({ name: req.body.name });
    if (nameExist) return res.status(400).json({ msg: 'Name already exists' });

    //hash pasword
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //create a new user
    const user = new User({
        name: req.body.name,
        password: hashPassword
    });
    try {
        await user.save()
        res.send('Congratulations, you have made an account!')
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
    if (validPass === true) {
        //create and assign token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

        res.cookie('session_id', token, { sameSite: 'none', secure: true, httpOnly: false })
        res.status(200).json({ msg: 'logged in' })
    }
    else { res.status(400).send('Name or password is wrong') }






});
module.exports = router;
module.exports.validateCookie = validateCookie;