export default class Result {
    success;
    message;
    returnCode;
    
    constructor(success, message, returnCode) {
        this.success = success;
        this.message = message;
        this.returnCode = returnCode;
    }
}