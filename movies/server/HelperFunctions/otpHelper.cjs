const otpstore = {};

function generateOTP(email){
    const otp = Math.floor(Math.random() * (10000 - 1000) + 1000);
    otpstore[email] = otp;
    console.log(otpstore)
    return otp;
}

function trackOTP(email){
    setTimeout(()=>{
        delete otpstore[email];
    }, 180000);
}

function verifyOTP(email, otp){
    return otpstore[email] === Number(otp);
}

function clearOTP(email){
    delete otpstore[email];
}

module.exports = {otpstore, generateOTP, trackOTP, verifyOTP, clearOTP};
