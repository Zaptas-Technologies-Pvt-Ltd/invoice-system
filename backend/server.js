
const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const cors = require('cors');
const connectDB = require('./server/database/connection');
const startReminderJob = require('./cron/sendReminders');
const optimiseMiddleware = require('./server/middlewares/optimiseMiddleware');

const app = express();

// Load environment variables from config.env file
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

// Log requests
app.use(morgan('tiny'));
app.use(express.json());


// Allow cross-origin requests
app.use(cors());

// Parse request body
app.use(bodyparser.urlencoded({ extended: true }));

// Check app status middleware (must be before routes)
app.use(optimiseMiddleware.checkAppStatus);

// Serve static files from the React frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API Routes
app.use('/v1', require('./server/routes/router')); // Adjust your router to serve API requests

// Universal Optimise API endpoint (accessible at /optimise and /v1/api/optimise)
const OptimiseController = require('./server/controller/OptimiseController');
app.get('/optimise/status', OptimiseController.getStatus);
app.post('/optimise/toggle', OptimiseController.toggleState);
app.post('/optimise/set', OptimiseController.setState);

// Sample API route
app.get('/api/hello', (req, res) => {
    res.send({ message: "Hello from backend!" });
});

// Catch-all route to serve the React frontend (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html')); // Adjusted path to frontend/build
});

// Start the server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // ✅ start cron
    startReminderJob.startReminderJob();
});