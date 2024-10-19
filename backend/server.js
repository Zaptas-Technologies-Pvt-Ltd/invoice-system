const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');

const connectDB =  require('./server/database/connection');

const app = express();

// Serve static files from the static directory
app.use(express.static(path.join(__dirname, '../static'))); // Adjusted to serve from the static folder in the root

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

// Log requests
app.use(morgan('tiny'));

// Allow cross-origin requests
app.use(cors());

// MongoDB connection
// connectDB(); // Uncomment if you need to connect to your database

// Parse requests with body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Load routers (adjust path if needed)
app.use('/', require('./routes/router')); // Ensure this path is correct

// Define an API endpoint
app.get('/api/hello', (req, res) => {
    res.send({ message: "Hello from backend!" });
});

// Serve index.html for all other routes (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // Serve index.html from the root
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
});
