/*eslint-disable*/
const fs  =require('fs')
const mongoose=require("mongoose");

const dotenv = require('dotenv');
const Tour  = require('./../../models/tourmodel')
dotenv.config({ path: './confige.env' }); // reads the file and saves them in node env variable


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

  //ReadJson file
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,"utf-8"));
  //import data into database

  const importData= async()=>{
    try{
        await Tour.create(tours)
        console.log(('data successfully included')); 
    }
    catch(err) {
        console.log(err);
    }
    process.exit();

  }

  //delete all the data from the collection 
  const DeleteData= async()=>{
    try{
        await Tour.deleteMany()
        console.log(('data successfully delted'));
    }
    catch(err) {
        console.log(err);
    }
    process.exit();

}


if(process.argv[2] == '--import'){
    importData()
}
else if(process.argv[2] ==='--delete'){
    DeleteData();

}
console.log(process.argv);
