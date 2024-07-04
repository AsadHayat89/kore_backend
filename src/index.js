// Import required modules
const routes = require('./routes/index');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Import the Express.js framework
//const routes = require('./routes'); // Import the routes module
const connectToDatabase = require('./internal/db.init'); // Import the function to connect to the database
const projectConfig = require('./config'); // Import project configuration
const startingMiddleware = require('./middlewares/starting.middleware'); // Import starting middleware

// Define a function to bootstrap the application
const bootstrap = async () => {
    // Create an Express application
    const app = express();

    // Apply starting middleware
    startingMiddleware(app);

    // Connect to the database
    await connectToDatabase();

    // Set trust proxy to enable 'X-Forwarded-For' header
    app.set('trust proxy', true);

    // Use the main router for handling routes
    app.use(routes);

    app.get('/reverse-geocode', async (req, res) => {
        const { lat, lon, apiKey } = req.query;

        if (!lat || !lon || !apiKey) {
            return res.status(400).send('Missing required query parameters: lat, lon, apiKey');
        }

        const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${lat}%2C${lon}%2C250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${apiKey}`;

        try {
            const response = await axios.get(url);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while fetching the reverse geocoding data');
        }
    });

    // Handle unexpected router hits by returning a 404 error
    app.all('*', (req, res, next) => {
        next(
            res.status(404).json({ err: `Can't find ${req.originalUrl} on this server!` })
        );
    });

    // Start the server and listen on the specified port
    app.listen(projectConfig.app.port, () => {
        console.log(`Server is running at ${projectConfig.app.port}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', err => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err);
    });

    // Handle SIGTERM signal (graceful shutdown)
    process.on('SIGTERM', () => {
        console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', err => {
        console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
        console.log(err);
    });
};

// Call the bootstrap function to start the application
(async () => {
    await bootstrap();
})();
