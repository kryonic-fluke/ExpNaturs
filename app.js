const express = require('express');
const app = express(); //this function will add bunch of method to app var

const port = 3000;

app.get('/', (req, res) => {
         res.status(200).json({message :"helloe from the server side",app:"Natours"})                           //get is the http method  ,  specifing what to do when this url is hit
});




app.listen(port, () => {
  //this is a callback function that will start as soonn as the server gets the request
  console.log(`app running on port ${port}...`);
});

//defining route
