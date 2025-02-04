/*eslint-disable*/

module.exports = fn =>{
    return (req,res ,next)=>{
      fn(req,res,next).catch(err=>next(err))             //this next will pass the error to global error handeling middleware             //this a async fun, if the promise fails , will catch the error 
    }
   }