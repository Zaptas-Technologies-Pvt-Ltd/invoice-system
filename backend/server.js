const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./server/database/connection');

const app = express();

dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

//athor origin
app.use(cors())



// set view engine
app.set("view engine", "ejs")

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

// load routers
app.use('/v1', require('./server/routes/router'));

// app.use(express.static(path.join(__dirname, 'public')))

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// app.use("/files", express.static("./public/files"));

app.listen(PORT, async () => {

  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`)
});