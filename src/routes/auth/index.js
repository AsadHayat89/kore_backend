/*
  Express Router Configuration for User Authentication Routes.

  - Defines routes for user signup, login, and checking authentication status.
  - Routes are handled by the corresponding controller methods.

  @module Router
*/

const express = require('express');
const router = express.Router();

// Import user authentication controller
const authController = require('../../controllers/auth_controller');

// Define routes and associate with controller methods
router.post('/signup', authController.createUser);
router.post('/login', authController.loginUser);
// router.get('/check-auth', authController.checkAuth);

// Additional routes (commented out for now)
router.post('/reset-password', authController.resetPassword);

router.get('/testing',(req,res)=>{
  console.log("testing");
  res.json({'tesitng':"testin"});
});

// Export the user authentication router
module.exports = router;
