const User = require('../model/profile');
const fs = require('fs');
const path = require('path');
async function createUser(req, res) {
    try {
        const { fullName, email, education, cv, drivingLicense, categories, interests } = req.body;
        console.log("data here: "+email);
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUser = new User({ fullName, email, education, cv, drivingLicense, categories, interests });

        // Save the user to the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user: ' + error.message });
    }
}

// Get all users
async function getUsers(req, res) {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error getting users: ' + error.message });
    }
}

// Get user by ID
async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error getting user by ID: ' + error.message });
    }
}


async function updateUser(req, res) {
    try {

        const { fullName, email, education, cv, drivingLicense, categories, interests } =req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find the user by email
        console.log("User: "+email);
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's data
        existingUser.fullName = fullName;
        existingUser.email = email;
        existingUser.education = education;
        existingUser.cv = cv;
        existingUser.drivingLicense = drivingLicense;
        existingUser.categories = categories;
        existingUser.interests = interests;

        // Save the updated user data
        const updatedUser = await existingUser.save();
        const updatea=updatedUser.toObject();
        res.status(200).json({ success: true, data:updatea });
    } catch (error) {
        res.status(500).json({success: false,data:{}, error: 'Error updating user: ' + error.message });
    }
}



// Delete user by ID
async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user: ' + error.message });
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