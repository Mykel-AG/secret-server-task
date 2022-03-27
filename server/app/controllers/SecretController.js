"use strict"
const { sendResponse } = require('../helpers/ResponseHelper');
const db = require("../models");

const Secret = db.secrets;


class SecretController {
    static async storeSecret(req, res) {
        try {
            const {
                expireAfter,
                secret
            } = req.body

            const expiry = expireAfter == 0 ? null : new Date(+new Date() + (expireAfter * 1000));
            const secretEntry = new Secret({
                secretText: secret,
                expiresAt: expiry
            });


            const data = await Secret.create(secretEntry);

            //Decrypt data
            data.decryptFieldsSync();

            sendResponse(req, res, 200, data);
        }
        catch (err) {
            console.log(err);
            sendResponse(req, res, 500, false, true, err);
        }

    }

    static async getSecret(req, res) {
        try {
            const hash = req.params.hash;

            //Encrypt `hash` to allow db search
            const enc_hash = new Secret({ hash });
            enc_hash.encryptFieldsSync();

            const currentDate = new Date();
            const data = await Secret.findOne({
                $or: [{ expiresAt: null }, { expiresAt: { $gte: currentDate }}
                ],
                $and: [{
                    hash: enc_hash.hash,
                }]


            }).exec();

            if (data) {
                sendResponse(req, res, 200, data);
            }
            else {
                sendResponse(req, res, 404);
            }


        }
        catch (err) {
            console.log(err);
            sendResponse(req, res, 500, false, true, err);
        }

    }
}

module.exports = SecretController;