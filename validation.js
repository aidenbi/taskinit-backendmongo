
const Joi = require('@hapi/joi');

//register validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        newpassword: Joi.string().min(6),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);

};


const loginValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        newpassword: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);

};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
