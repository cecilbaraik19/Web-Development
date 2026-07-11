const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../utils/email');

//Register User
exports.registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    let userExits = await User.findOne({email});
    if(userExits){
        return res.status(400).json({error: 'User already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        const user = await User.create({name, email, password: hashedPassword, roler: 'user',isVerified:false});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);
        await OTP.create({email, otp, action: 'account_verification'});
        await sendOTPEmail(email,otp,'account_verification');

        res.status(201).json({
            message: 'User registered successfully. Please check your email for OTP to verify your account',
            email:user.email
        })

        
    }catch(error){
        res.status(400).json({error: error.message});
    }
};