
const app  =  require("./app")
const port = 3000;

// Starting the Server
app.listen(port, () => {
    // this is a callback function that will start as soon as the server gets the request
    console.log(`app running on port ${port}...`);
  });