const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {username, eamil, password} = req.body;
    try{
        let user = await User.findOne({username});
        if(user){
            return res.status(400).json({message: 'Username already exists'});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Passwords do not match'});
            
        }

        const payload = { userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"1h"});

        res.cookie("token", token,{httpOnly: true}).json({message: 'User registered successfully',token});

    } catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

