/* eslint-disable */
const mongoose=require("mongoose");

const dotenv = require('dotenv');

process.on('uncaughtException',(err)=>{
  console.log('uncaughtException');
  console.log(err.name,err.message);
  server.close(()=>{             //shutting the app gracefully , first closing the server, then closing the application 
    process.exit(1); //0 sucess/ 1 exceptions
  })
})
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
const server=app.listen(port, () => {
  // this is a callback function that will start as soon as the server gets the request
  console.log(`app running on port ${port}...`);
});

//Test 
//if any unhandeled rejectioin is emmited , process(obj) returns an unhandeled rejection, then we can subscribe to the event
process.on('unhandledRejection',err=>{  //listening unhandledRejection event 
  console.log(err.name, err.message);
  console.log('Unhandled rejection');
  server.close(()=>{             //shutting the app gracefully , first closing the server, then closing the application 
    process.exit(1); //0 sucess/ 1 exceptions
  }) 
})

