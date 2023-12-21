
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
import router from "./routes/user";
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./openApiDocumentation/swagger.json');


app.use(bodyParser.json());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs));
app.use('/', router);
app.listen(8080, ()=>{
    console.log("Listening the port at 8080");
});
