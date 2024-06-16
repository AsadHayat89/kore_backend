/*
  Express Router Configuration for User Authentication Routes.

  - Defines routes for user signup, login, and checking authentication status.
  - Routes are handled by the corresponding controller methods.

  @module Router
*/

const express = require('express');
const router = express.Router();

// Import user authentication controller
const profileController = require('../../controllers/profile_controller');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

// Define routes and associate with controller methods
router.post('/create_profile', profileController.createUser);
router.patch('/update_profile',profileController.updateUser);
router.get('/user',profileController.getUserByemail);
// Additional routes (commented out for now)
router.post('/upload-image', upload.single('image'),profileController.uploadImage);

router.get('/testing',(req,res)=>{
  console.log("testing");
  res.json({'tesitng':"testin"});
});

// Export the user authentication router
module.exports = router;
