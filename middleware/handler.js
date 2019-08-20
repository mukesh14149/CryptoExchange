const Response = require("../models/Response");
const CustomError = require("../models/CustomError");
module.exports = function(handler){
    return async (req, res, next) => {
        try{
            await handler(req, res);
        }catch(err){
            if (err instanceof CustomError) {
                res.status(err.code).send(new Response(err.code, null, err.message));
            } else {
                console.log(err);
                res.status(500).send(new Response(500, null, new CustomError(500, err.message)));
            }
        }
    }
}