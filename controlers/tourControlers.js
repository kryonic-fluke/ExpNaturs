/* eslint-disable */
// const fs = require("fs")
const Tour = require("./../models/tourmodel")

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//   );
  


  // exports.checkId=(req,res,next,val)=>{
  //   if (val * 1 > tours.length) {
  //     return res.status(404).json({
  //       //using return to immediately end the function
  //       status: 'fail',
  //       message:
  //         "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️",
  //     });
  //   }
  //   next();
  // }

//   exports.checkDataExists=(req, res, next)=>{
   
//    if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Data not defined'
//     });
//   }
//   next();

// }

//2) Route handlers------------------------------
exports.getAllTours = async (req, res) => {
                            

try{
  // Alternate method:: const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')  //mongoose way of quering
  //Build Query 
  //Filtering 
  const queryObj  = {...req.query}
  const excludeFields = ['page', 'sort', 'limit','filed'];
  excludeFields.forEach(el=> delete queryObj[el])

  //Advance Filtering

  let queryStr =JSON.stringify(queryObj);
  queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
  console.log();
  

  const query = Tour.find(JSON.parse(queryStr))     
 

  //Execute the query 
  const tours = await query
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length, 
    data: { 
      tours
    },
  });
}
catch (err){
res.status(404).json({
  message:err,

});
}

}
   
  
  
  // -------------------------------------------------------------------
   //var is id, multiple ids can be defined /:var/x/y, vars can be made optional using "?"
    //can create new version of api to do some changes , function is called a route handler
   //console.log(req.params); //req.params gets the value of var
    
  exports.getATour = async(req, res) => {
    try{
    const tours= await Tour.findById(req.params.id)  //equivalent to Tour.findOne({_id:req.params.id})
      // const tour = tours.find((el) => el.id === id);
      res.status(200).json({
        status: 'success',
        data: {
          tours,
        },
      });
    }
    catch (err){
      res.status(404).json({
        status:'fail',
        message:
          err.meggage
        
      })

    }
   
  };
  
  //-----------------------------------------------------------
  
  exports.CreateNewTour = async(req, res) => {
    //with post request the data is sent by client to the server,req object hold the data about the request done
    // console.log(req.body);
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
  
    // tours.push(newTour); //modifying
    // fs.writeFile(
    //   `${__dirname}/dev-data/data/tours-simple.json`,
    //   JSON.stringify(tours),
    //   (err) => {
    //     //writing the modified tour
    //     res.status(201).json({
    //       //showing the newTour
    //       status: 'success',
    //       data: {
    //         tourS: newTour,
    //       }, //this data will be received by the client
    //     });
    //   }
    // );


    try{
      const newTour = await Tour.create(req.body)   //calling method on model itself     
            console.log(req.body);
            
      res.status(201).json({
        //showing the newTour
        status: 'success',
        data: {
          tourS: newTour,
        }, //this data will be received by the client
      });
    }
    catch (err){
        res.status(400).json({
          status:'fail',
          message:err.message
        })
    }
    
  };
  
  // -------------------------------------------------------------
  
  exports.UpdateTour =async (req, res) => {
  try{
   const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true ,
      runValidators:true,

   } )
    res.status(200).json({
      status: 'success',
      data: {
         tour,
      },
    });
  }

  catch(err){
    res.status(400).json({
      status:'fail',
      message:err.message
    })
  }
   
  };
  
  // -----------------------------------------------------------------
  
  exports.DeleteTour = async(req, res) => {

    try{
      await Tour.findByIdDelete(req.params.id)
      res.status(204).json({
        status: 'sucess',
        data: null,
      });
    }
    catch (err){
      res.status(404).json({
        status:'fail',
        message:err.message
      })
    }
   
  };


  
  