
// @desc this class for opertional errors: (Errors thet we can predict)
class APIError extends Error {
    constructor(messgae,statusCode){
        super(messgae);
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'err' ;
        this.isOpertional = true ; // to distinct these APIErrors from other errors
    }
};

module.exports  = APIError ; 