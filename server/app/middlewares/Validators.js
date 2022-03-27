"use strict";
const { body, validationResult, param } = require('express-validator');
const { sendResponse } = require('../helpers/ResponseHelper');

module.exports  = {
    validate (values = []) {
        return async (req, res, next) => {
            await Promise.all(values.map(value => value.run(req)));
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }
            sendResponse(req, res, 405, errors.array());
        };
    },

    check_valid_hash: [
        param('hash').isString().isLength({min: 10})
    ],

    check_secret_input: [
        body('secret').isString().not().isEmpty().withMessage("The field cannot be empty"),
        body('expireAfter').isInt().custom(value => { return value >= 0}).withMessage("Expiry cannot be less than 0")
    ],

}