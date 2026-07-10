const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMIAL_PASS
    }
});

exports.sendOTPEmail = async (email, options, type) =>{
    try{
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Yout OTP code is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email} for ${type}`);
    }
    catch(error){
        console.error(`Error sending OTP email to ${email} for ${type}:`,error);
    }

   
}