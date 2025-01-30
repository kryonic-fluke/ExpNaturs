 // Alternate method:: const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')  //mongoose way of quering
  //Build Query 
  //Filtering 
  // const queryObj  = {...req.query}
  // const excludeFields = ['page', 'sort', 'limit','fields'];
  // excludeFields.forEach(el=> delete queryObj[el])

  // //Advance Filtering

  // let queryStr =JSON.stringify(queryObj);
  // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
  // console.log(); 
  
 
  // let query = Tour.find(JSON.parse(queryStr))    //returns a query obj   
 
  //Sorting

  // if(req.query.sort){
  //   const sortBY=  req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBY);

  // }

  // else{
  //   query=query.sort('-createdAt')
  // }

  // Filed limiting 
  // if(req.query.fields){    
  //   const fields =req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // }
  // else{
  //   query = query.select('-__v')
  // } 


  //Pagination
  //to skip pages, we have to tell in form of how many documents we have to skip to get to the desired page
  // const page = req.query.page *1 || 1;
  // const limit = req.query.limit * 1||100;
  // const skip=(page -1)*limit
  // query=query.skip(skip).limit(limit)  

 
  // if(req.query.page){
  //   const numTours =await Tour.countDoucments();
  //    if(skip>=numTours) throw new Error('This page does not exists');



  // }








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