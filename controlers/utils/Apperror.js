/*eslint-disable*/
class AppError extends Error{
constructor(message,statusCode){
    super(message);  //calling parent's contructor , calling this sets the message property to message

    this.statusCode=statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational  =true;

    Error.captureStackTrace(this,this.constructor) //By excluding the constructor function, the stack
    //  trace becomes cleaner and more focused on where the error actually occurred, rather than showing internal details of the custom error class.
}
}


module.exports=AppError

