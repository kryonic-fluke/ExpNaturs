const express = require('express');
const app = express(); //this function will add bunch of method to app var
const fs = require('fs');

const port = 3000;
// app.get('/', (req, res) => {
//          res.status(200).json({message :"helloe from the server side",app:"Natours"})                           //get is the http method  ,  specifing what to do when this url is hit
// });
// app.post("/" ,(req,res)=>{
//     res.send("You can post to this endPoint...")
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours/', (req, res) => {
  //can ccreate new cersion of api to do some changes , function is called a route handler
  res.status(200).json({
    status: 'success',
    results: tours.length,
    joke: 'ongabonga donga',
    data: {
      tours: tours,
    },
  });
});
// -------------------------------------------------------------------
app.get('/api/v1/tours/:id', (req, res) => {   //var is id, multiple ids can be defined /:var/x/y, vars can be made optional using "?" 
  //can ccreate new cersion of api to do some changes , function is called a route handler
  console.log(req.params);  //req.params gets the value of var 
  const id = req.params.id*1;
  if(id>tours.length)  {
return res.status(404).json({        //using return tp immediately end the function
  status:"fail",
  message : "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️"
})
  }
  const tour = tours.find(el=> el.id ===id)
  res.status(200).json({
    status: 'success',
    data:{
      tour,
    }
  });
});




//-----------------------------------------------------------

app.use(express.json()); //this is the midddle ware that can modify the incoming data, it stands between req and res , data from the body(property of a req) is added to it

app.post('/api/v1/tours/', (req, res) => {
  //with post request the data is sent by client to the server,req object hold the data about the request done
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour); //modifying
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //writing the modified tour
      res.status(201).json({
        //showing the newTour
        status: 'success',
        data: {
          tourS: newTour,
        },                         //this data will be received by the client 
      });
    }
  );

  // res.send('Done'); //this is received by the client after it posts
});
// -------------------------------------------------------------
app.patch("/api/v1/tours/:id",(req,res)=>{
  if(req.params.id *1 >tours.length)  {
    return res.status(404).json({        //using return to immediately end the function
      status:"fail",
      message : "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️"
    })
  }

 

  res.status(200).json({
    status:"success",
    data:{
      tour:"<Updated tour here...>"
    }
  })
})

// -----------------------------------------------------------------

app.delete("/api/v1/tours/:id",(req,res)=>{
  if(req.params.id *1 >tours.length)  {
    return res.status(404).json({        //using return to immediately end the function
      status:"fail",
      message : "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️"
    })
  }
    res.status(204).json({
      status: "sucess",
      data:null,
    })
  
})

app.listen(port, () => {
  //this is a callback function that will start as soonn as the server gets the request
  console.log(`app running on port ${port}...`);
});

//defining route
