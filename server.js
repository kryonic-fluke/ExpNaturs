/* eslint-disable */
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1); // For uncaught exceptions, we can exit directly since no server exists yet
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './confige.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DTA_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Crud databse is connected');
  });

const port = process.env.PORT || 49200;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});


process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('Unhandled rejection');
  server.close(() => {
    process.exit(1);
  });
});
