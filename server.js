 require("dotenv").config();
const cors = require("cors");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");
const config = require('./config/database')
const passport = require('passport')





mongoose.connect(config.database)

mongoose.connection.on('connected', ()=>{
    console.log("connected to db " + config.database)
})

mongoose.connection.on('error', (err)=>{
    console.log("database error " + err)
})


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8080;

const users = require('./routes/users')
const webSocket = require('./routes/websocket')

app.use(passport.initialize())

app.use(passport.session())

require('./config/passport')(passport)

app.use('/users', users)
 app.use('/websocket', webSocket.router)






app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });


    app.listen(port);
    console.log("Listening on localhost:8080");