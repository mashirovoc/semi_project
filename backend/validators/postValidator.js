const { body, validationResult } = require('express-validator');

const postValidator = [
    //TODO: Change when media only post avaliable
    body('content').isString().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Syntax error' });
        }
        next();
    }
];

module.exports = postValidator;