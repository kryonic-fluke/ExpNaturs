const express = require('express');
const app = express(); //this function will add bunch of method to app var
const fs = require('fs');
const morgan = require('morgan');

const port = 3000;
//1) Middleware
app.use(morgan('dev')); //gives the info about the request in the console
app.use(express.json()); //this is the midddle ware that can modify the incoming data, it stands between req and res , data from the body(property of a req) is added to it

app.use((req, res, next) => {
  //this middleware is applied to each request that comes after it
  console.log('hello from the middleware 😊');
  next(); //if we didn't call the next  the req response cycle will be stuck
});

//the routehandler before middleware sends the response, ending the req res cycle , so the next middleware in the stack after that does not get called.

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2) Route handlers------------------------------
const getAllTours = (req, res) => {
  //can ccreate new cersion of api to do some changes , function is called a route handler
  res.status(200).json({
    status: 'success',
    results: tours.length,
    joke: 'ongabonga donga',
    data: {
      tours: tours,
    },
  });
};

// -------------------------------------------------------------------

const getATour = (req, res) => {
  //var is id, multiple ids can be defined /:var/x/y, vars can be made optional using "?"
  //can ccreate new cersion of api to do some changes , function is called a route handler
  console.log(req.params); //req.params gets the value of var
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      //using return tp immediately end the function
      status: 'fail',
      message:
        "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️",
    });
  }
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

//-----------------------------------------------------------

const CreateNewTour = (req, res) => {
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
        }, //this data will be received by the client
      });
    }
  );
};

// -------------------------------------------------------------

const UpdateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      //using return to immediately end the function
      status: 'fail',
      message:
        "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️",
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// -----------------------------------------------------------------

const DeleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      //using return to immediately end the function
      status: 'fail',
      message:
        "Can not find the requested id , wtf are you actually trying to achieve, get your act together , man you're embarassing 🤦‍♂️",
    });
  }
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};

// ----------------------------------------------------------------------
//3) Routes
// app.get('/api/v1/tours/', getAllTours);
// app.get('/api/v1/tours/:id', getATour);
// app.post('/api/v1/tours/',CreateNewTour); // res.send('Done'); //this is received by the client after it posts;
// app.patch('/api/v1/tours/:id',UpdateTour);
// app.delete('/api/v1/tours/:id', DeleteTour);

// =------------=-=-========================-=------------=-=
// New way of writing
const tourRouter = express.Router();

app.use('/api/v1/tours', tourRouter); //tourRouter is a middleware that will be ued for the speacified route
//request goes into middleaware stack, and matches the specified url, then function will run

tourRouter.route('/').get(getAllTours).post(CreateNewTour);
tourRouter //its a middlware
  .route('/:id')
  .patch(UpdateTour)
  .delete(DeleteTour) 
  .get(getATour);

const useRouter = express.Router();

app.use('/api/v1/users', useRouter);

useRouter.route('/').get(getAllUsers).post(createUsers);

useRouter.route('/:id').get(getAuser).patch(UpdateUser).delete(deleteUser);

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const getAuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const UpdateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
// ----------------------------------------------
// starting the Serverm

app.listen(port, () => {
  //this is a callback function that will start as soonn as the server gets the request
  console.log(`app running on port ${port}...`);
});

//defining route
