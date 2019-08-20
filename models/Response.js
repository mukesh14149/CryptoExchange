class Response {
  constructor(statusCode,result, error) {
  	this.statusCode = statusCode;
    this.result = result;
    this.error = error;
  }
}
module.exports = Response;
