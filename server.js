/* eslint-disable */
const mongoose=require("mongoose");

const dotenv = require('dotenv');
dotenv.config({ path: './confige.env' }); // reads the file and saves them in node env variable

const app = require('./app');

//console.log(app.get('env')); //to chk, in which env we are currently working in
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DTA_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('db connection successful');
  });

const port = process.env.PORT || 49200;

// Starting the Server
app.listen(port, () => {
  // this is a callback function that will start as soon as the server gets the request
  console.log(`app running on port ${port}...`);
});
