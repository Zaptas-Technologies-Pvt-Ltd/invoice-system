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

// Parse request body
app.use(bodyparser.urlencoded({ extended: true }));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../invoiceworld')));

// Catch-all route to serve the React frontend for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../invoiceworld', 'index.html'));
});

// Load routers for API routes
app.use('/', require('./server/routes/router'));

// Sample API route
app.get('/api/hello', (req, res) => {
    res.send({ message: "Hello from backend!" });
});

// Start the server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
