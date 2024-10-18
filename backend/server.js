const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const cors = require('cors');

const connectDB = require('./server/database/connection');

const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

//athor origin
app.use(cors())

// mongodb connection
connectDB();

// set view engine
app.set("view engine", "ejs")

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// load routers
app.use('/', require('./server/routes/router'))
app.use("/files",express.static("./public/files"));

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`,process.env.MONGO_URI)});