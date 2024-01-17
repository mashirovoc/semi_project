const { body, validationResult } = require('express-validator');

const registerValidator = [
    body('username').isString().isLength({ min: 1, max: 15 }).notEmpty(),
    body('email').isEmail().notEmpty(),
    body('password').isString().isLength({ min: 3 }).notEmpty(),
    body('name').isString().notEmpty(),
    body('avatar').isURL().optional({ nullable: true }),
    body('bio').isString().optional({ nullable: true }),
    body('birthday').isDate().optional({ nullable: true }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Syntax error' });
        }
        next();
    }
];

module.exports = registerValidator;