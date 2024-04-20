const User = require('../model/auth');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const profileContrller=require('./profile_controller');
async function createUser(req, res) {
    try {
        const { username, email, password, deviceToken } = req.body;
        
        // Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with hashed password
        const newUser = new User({ username, email, hashedPassword, deviceToken });
        const profile=profileContrller.createUser(req);
        // Save the user to the database
        const savedUser = await newUser.save();
        const userResponse = savedUser.toObject();
        delete userResponse.hashedPassword;

        // Return success response with saved user data
        res.status(201).json({ success: true, body: { data: userResponse } });
    } catch (error) {
        // Handle error
        res.status(500).json({ success: false, error: 'Error creating user: ' + error.message });
    }
}


// Reset password - Update user's password with new password
async function resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;
  
      // Find user by reset token and check if the token is valid
      const user = await User.findOne({ resetToken, resetTokenExpires: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
  
      // Hash the new password and update user's password in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.hashedPassword = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
  
      // Return success response
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error resetting password: ' + error.message });
    }
  }
  

//user Login
async function loginUser(req, res) {
    try {
        // Extract email/username and password from request body
        const { email, username, password } = req.body;

        // Check if email or username exists in the request body
        if (!(email || username) || !password) {
            return res.status(400).json({ success: false, message: 'Email/Username and password are required.' });
        }

        // Check if user exists by email or username
        let user;
        if (email) {
            user = await getUserByEmail(email);
        } else {
            user = await getUserByUsername(username);
        }

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password.' });
        }

        // Password is correct, generate JWT token
        const token = jwt.sign({ userId: user._id }, 'secret'); // Change the secret key

        // Return success and user data along with token
        return res.status(200).json({ success: true, body: { token: token, data: user } });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, body: 'Internal server error.' });
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new Error('Error getting user by email: ' + error.message);
    }
}

// Get user by username
async function getUserByUsername(username) {
    try {
        const user = await User.findOne({ username });
        return user;
    } catch (error) {
        throw new Error('Error getting user by username: ' + error.message);
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

// Update user by ID
async function updateUser(req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user: ' + error.message });
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




module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    resetPassword
};
