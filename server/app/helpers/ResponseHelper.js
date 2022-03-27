class ResponseHelper{

    static async sendResponse(
        req,
        res,
        status,
        data = null,
        error = null,
        message = null
        ){
        let response = {
            data: data ? data : false,
            error: error ? true : false
        }

        switch (status){
            case 200:
                response["message"] = message ? message : "successful operation";
                break;
            case 404:
                response["error"] = true;
                response["message"] = message ? message : "Secret not found";
                break;
            case 405:
                response["error"] = true;
                response["message"] = message ? message : "Invalid input";
                break;
        }

        return res.status(status).json(response)

    }
}

module.exports = ResponseHelper;