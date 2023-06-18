// npm init initializes the package.json, packagelock.json and brings those libraries like express
//npm i express to install the libraries into the package.json
//bodyParser, cors, mogodb
const express = require('express');  //initializes express using require(connects frontend to backend)
const bodyParser = require('body-parser');  //initializes body-parser using require
var cors = require('cors'); //initializes cors using require (permission to connect backend to frontend/api calls etc)
const app = express(); //create the express application
var { MongoClient } = require('mongodb'); //connect to mongodb library
var url = 'mongodb+srv://marketAI:abcd1234@marketai-cluster1.4m8j0.mongodb.net/marketAI-DB?retryWrites=true&w=majority'; //url for the mongodb database
//process of hooking to database
var db = null;  
var client = null;
let stockTicker = []; //variable to store input from frontend react to be sent to the model.py parameter

let pythonMessage = []; 

//connect to the mongodb followed marko's code
async function connect() {
  if (db == null) {
    var options = {
      useUnifiedTopology: true,
    };
    client = await MongoClient.connect(url, options);
    db = await client.db("marketAI-DB");
  }

  return db;
}

//practice
async function register(username, password) {
  var conn = await connect();
  var existingUser = await conn.collection('users').findOne({ username });
  // if (existingUser != null) {
  //     throw new Error('exists siiiiuuu')
  // }
  conn.collection('users').insertOne({ username, password })
}

app.use(cors()); //allow permissions of backend to frontend
app.use(express.json()) //allows frontend to connect to backend through a .json type
app.use(bodyParser.urlencoded({ extended: true })) 

//perform express application
app.post("/api/signup", async (req, res) => { //post request on the endpoint(when we reach the signup page on the frontend)
  var conn = await connect(); //connect to database
  //collect the input variables from the input fields in the frontend signup page
  const firstName = req.body.firstname
  const lastName = req.body.lastname
  const email = req.body.email
  const userName = req.body.username
  const password = req.body.password
  //insert these input variables into the database
  conn.collection('users').insertOne({ firstname: firstName, lastname: lastName, email: email, username: userName, password: password }, (err, result) => {
    console.log(result) //check the results by printing in terminal
  })
})

//reach ticker endpoint
app.post('/api/ticker', async (req, res) => {
  let tickerSymbol = req.body.tickerSymbol  //ticker symbol is the input from the front end
  if (tickerSymbol == 'appl') {                //bs
    console.log('siu')                           //bs
  }
  else {
    for (let i = 0; i < tickerSymbol.length; i++) {        //go through length of ticker symbol
      // console.log(tickerSymbol[i])
      stockTicker.push(tickerSymbol[i])                 //push the ticker into stockTicker
    }
  }
  console.log(stockTicker.toString().replace(/,/g, ""))         
  stockTicker = stockTicker.toString().replace(/,/g, "")          //filtering/piping the data(cleaning it up)
})

app.get('/api/dashboard', async (req, res) => { 
  res.send(`${stockTicker}`)               //sending stock ticker input to the frontend of the dashboard page
})

app.post("/api/login", async (req, res) => {
  var conn = await connect();            //connect to database
  //login info from frontend
  const userName = req.body.username
  const password = req.body.password
  //search through the database if the username and password are the same
  conn.collection('users').findOne({ username: userName, password: password }, (err, result) => {
    console.log(result)
    res.send(result)      //sends user and pass to the frontend
  })
})

let content = '';
const { application } = require('express');


app.post('/api/ML', async (req, res) => {        //dashboard page endpoint call on this function

  const { spawn } = require('child_process');        
  console.log('reaches')
  //using childprocess to run model.py 
  const childPython = await spawn('python', ['model.py', `${stockTicker}`]);     //stockTicker is the input that is brought from the frontend
  //outputs the data from model.py
  await childPython.stdout.on('data', (data) => {
    content = `${data}`
    console.log(content)
  })
  //gives the time for the model.py to run and runs after timeout is over
  setTimeout(() => res.send(`${content}`), 20000);
  
});

//test
app.get('/', async (req, res) => {
  res.send('siiiu')

})

//
app.post('/api/transfer', async (req, res) => {
  res.send(`${pythonMessage}`)

})

//starts the application running on the port
app.listen(3001, () => {
  console.log("running on port 3001") //when it prints, it shows the express application is running
})
