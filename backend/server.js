const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const cors = require('cors');

const connectDB = require('./server/database/connection');

const app = express();

// Load environment variables from config.env file
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

// Log requests
app.use(morgan('tiny'));

// Allow cross-origin requests
app.use(cors());

// MongoDB connection
// Call the connectDB function to establish a connection
await connectDB();

// Parse request body
app.use(bodyparser.urlencoded({ extended: true }));

// Load routers
app.use('/', require('./server/routes/router'));

// Sample API route
app.get('/api/hello', (req, res) => {
    res.send({ message: "Hello from backend!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
