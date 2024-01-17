const { query, validationResult } = require('express-validator');

const searchValidator = [
    query('q').isString().notEmpty(),
    query('page').isInt().optional(),
    query('limit').isInt({ min: 1, max: 100 }).optional(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Syntax error' });
        }
        next();
    }
];

module.exports = searchValidator;