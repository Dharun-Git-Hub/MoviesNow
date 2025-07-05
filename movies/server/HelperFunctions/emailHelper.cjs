const nodemailer = require('nodemailer');
const { generateOTP, trackOTP } = require('./otpHelper.cjs');

async function sendEmail(email, username, processEnv){
    let usr = username !== 'Adm' ? username : 'Admin';
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: processEnv.mailuser,
            pass: processEnv.mailpass,
        },
    });
    const otp = generateOTP(email);
    const mailOptions = {
        from: processEnv.mailuser,
        to: email,
        subject: '3 Minutes OTP from Movies...',
        text: `${usr}, Your OTP for Movies is ${otp} only valid for 3 Minutes! Hurry up!...`,
    };
    transporter.sendMail(mailOptions,(err)=>{
        if(err){
            console.log(err);
        }
    });
    trackOTP(email);
    return otp;
}

module.exports = { sendEmail };
