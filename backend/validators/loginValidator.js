const { body, validationResult } = require('express-validator');

const loginValidator = [
    body('email').isEmail().notEmpty(),
    body('password').isString().isLength({ min: 3 }).notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Syntax error' });
        }
        next();
    }
];

module.exports = loginValidator;