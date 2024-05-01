const Profile = require('../model/profile');
const fs = require('fs');
const path = require('path');
async function createUser(req) {
    try {
        const { fullName, email, education, cv, drivingLicense, categories, interests } = req.body;
        console.log("data here: "+email);
        // Check if email already exists
        const existingUser = await Profile.findOne({ email:email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const newUser = new Profile({ fullName, email, education, cv, drivingLicense, categories, interests });
        // Save the Profile to the database
        const savedUser = await newUser.save();
        //res.status(201).json({});
    } catch (error) {
        console.log(error);
        //res.status(500).json({ error: error });
    }
}

// Get all users
async function getUsers(req, res) {
    try {
        const users = await Profile.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error getting users: ' + error.message });
    }
}

// Get Profile by ID
async function getUserById(req, res) {
    try {
        const Profile = await Profile.findById(req.params.userId);
        if (!Profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(Profile);
    } catch (error) {
        res.status(500).json({ error: 'Error getting Profile by ID: ' + error.message });
    }
}


async function updateUser(req, res) {
    try {

        const { fullName, email, education, cv, drivingLicense, categories, interests } =req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find the Profile by email
        console.log("Profile: "+email);
        const existingUser = await Profile.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Update the Profile's data
        existingUser.fullName = fullName;
        existingUser.email = email;
        existingUser.education = education;
        existingUser.cv = cv;
        existingUser.drivingLicense = drivingLicense;
        existingUser.categories = categories;
        existingUser.interests = interests;

        // Save the updated Profile data
        const updatedUser = await existingUser.save();
        const updatea=updatedUser.toObject();
        res.status(200).json({ success: true, data:updatea });
    } catch (error) {
        res.status(500).json({success: false,data:{}, error: 'Error updating Profile: ' + error.message });
    }
}



// Delete Profile by ID
async function deleteUser(req, res) {
    try {
        const deletedUser = await Profile.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Profile: ' + error.message });
    }
}

async function uploadImage(req, res) {
    try {
        var image = req.file;
        var outputDirectory = directryPath();
        var pathdata = convertImage(image.originalname);

        const imagePath = path.join(outputDirectory, pathdata);
        fs.writeFileSync(imagePath, image.buffer, function (err) {
            reject(err)
        });

        res.status(201).json({ success: true, body: { url: 'profile/'+pathdata } });
    }
    catch (e) {
        res.status(500).json({ success: false, body: {}, error: e.message });
    }
}

function convertImage(OriginalImage) {
    var fil = OriginalImage.split('.')
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/:/g, '-');
    fil[0] += "-" + formattedDate;
    return fil[0] + '.' + fil[1];
}

function directryPath() {
    const outputDirectory = path.resolve(__dirname, '../../profile');
    
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }

    return outputDirectory;
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadImage
};