const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;  // fixed typo "eamil" to "email"
    try {
        // Check if the username or email already exists in the database
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // If username is unique, proceed to check email uniqueness as well
        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save it to the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await newUser.save();

        // Generate JWT token for the new user
        const payload = { userId: newUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set a cookie with the token and respond with success message
        res.cookie("token", token, { httpOnly: true }).json({ message: 'User registered successfully', token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
  
      // Create JWT token
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      // Send response with token
      res.cookie("token", token, { httpOnly: true }).json({ msg: "Logged in", token });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  };