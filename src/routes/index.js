const express = require('express');
const router = express.Router();

//Import sub-routers
const authRoute = require('./auth');
const profileRoute=require('./profile');
// Mount sub-routers at specific paths
router.use('/api/auth-service', authRoute);
router.use('/api/user-service',profileRoute);
// Export the main router
module.exports = router;
