const fs = require("fs")


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );
  
//2) Route handlers------------------------------
exports.getAllTours = (req, res) => {
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
  
  exports.getATour = (req, res) => {
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
  
  exports.CreateNewTour = (req, res) => {
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
  
  exports.UpdateTour = (req, res) => {
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
  
  exports.DeleteTour = (req, res) => {
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


  
  