const User = require('../models/User');

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
        const user = new user({name, email, password});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    }catch(error){
        res.status(400).json({error: error.message});
    }
};