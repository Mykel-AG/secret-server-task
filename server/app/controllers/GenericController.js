"use strict"
const { sendResponse } = require('../helpers/ResponseHelper');

class GenericController{

    static async handleInvalidRoute(req, res){
        sendResponse(req, res, 404, false, true, "Invalid Route");
    }
}

module.exports = GenericController;