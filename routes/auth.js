const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



async function validateCookie(req, res, next) {
    const cookies = req.cookies;

    if ('session_id' in cookies) {
        try {
            const userid = jwt.verify(cookies.session_id, process.env.TOKEN_SECRET)._id
            res.locals.userid = userid
            const userinfo = await User.findOne({ _id: userid });
            res.locals.username = userinfo.name
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
    if (error) return res.status(400).send({ msg: error.details[0].message });
    //check user if already in database
    const nameExist = await User.findOne({ name: req.body.name });
    if (nameExist) return res.status(400).send({ msg: 'Name already exists' });

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
        res.send({ msg: 'Congratulations, you have made an account!' })
    } catch (err) {
        res.status(400).send({ msg: err });
    }
});


//logout
router.get('/logout', async (req, res) => {
    try {
        res.cookie('session_id', 0, { sameSite: 'none', secure: true, maxAge: 1 })
        res.send({ msg: 'Logged out' })
    } catch (err) {
        res.json({ msg: err });
    }
})

//login
router.post('/login', async (req, res) => {
    const cookies = req.cookies;
    const logincred = req.body
    if ('session_id' in cookies) {
        const userid = jwt.verify(cookies.session_id, process.env.TOKEN_SECRET)._id
        const userinfo = await User.findOne({ _id: userid });
        return res.status(200).json(userinfo)
    }
    if ('name' in logincred && 'password' in logincred && 'newpassword' in logincred) {
        //validate
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send({ msg: error.details[0].message });
        //check if name exists
        const user = await User.findOne({ name: req.body.name });
        if (!user) return res.status(400).send({ msg: 'Name or password is wrong' });
        const validnewPass = await bcrypt.compare(req.body.newpassword, user.password)
        //pass is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (validPass === true || validnewPass === true) {
            //create and assign token
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
            res.cookie('session_id', token, { sameSite: 'none', secure: true, maxAge: 900000 })
            res.status(200).json(user)
        } else { res.status(400).send({ msg: 'Name or password is wrong' }) }
        if (validPass === true && validnewPass !== true) {
            const salt1 = `$2a$10$${process.env.REACT_APP_SALT_ONE}`
            const hashPassword = await bcrypt.hash(req.body.password, salt1);
            const salt = await bcrypt.genSalt(10);
            const hashnewPassword = await bcrypt.hash(hashPassword, salt);
            await User.updateOne({ name: req.body.name }, {
                $set: {
                    name: req.body.name,
                    newpassword: hashnewPassword
                }
            })
        }
    }






});
module.exports = router;
module.exports.validateCookie = validateCookie;