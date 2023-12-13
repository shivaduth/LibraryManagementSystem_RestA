
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const userRoute = require('./routes/user');


app.use(bodyParser.json());
app.use(express.json());

app.use('/', userRoute);
app.listen(8080, ()=>{
    console.log("Listening the port at 8080");
});
