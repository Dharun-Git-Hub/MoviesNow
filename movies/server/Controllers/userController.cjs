const User = require('../Schema/UserSchema/UserSchema.cjs');
const { sendEmail } = require('../HelperFunctions/emailHelper.cjs');
const { otpstore, verifyOTP, clearOTP } = require('../HelperFunctions/otpHelper.cjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtsecret = process.env.jwtsecret;

let waiting;

exports.signupEmail = async(req, res) => {
    const {username, email, password, mobile} = req.body;
    const image = req.file ? fs.readFileSync(req.file.path) : null;
    const exists = await User.findOne({email});
    if(!exists){
        try{
            waiting = {username, password, email, mobile, pic: image};
            sendEmail(email, username, process.env);
            fs.unlinkSync(req.file.path);
            return res.json({status: 'success', email, username });
        }
        catch(err){
            fs.unlinkSync(req.file.path);
            return res.json({status: 'failure', message: 'User Already Found'});
        }
    }
    else{
        fs.unlinkSync(req.file.path);
        return res.json({status: 'failure', message: 'User Already Found'});
    }
};

exports.validateEmail = async(req, res) => {
    const {email, password} = req.body;
    const exists = await User.findOne({email});
    if(exists){
        if(exists.password === password){
            sendEmail(exists.email, exists.username, process.env);
            return res.json({status: 'success', email: exists.email, username: exists.username});
        }
        else{
            return res.json({status: 'failure', message: 'Invalid Credentials'});
        }
    }
    else{
        return res.json({status: 'failure', message: 'No Users Found! Signup first!'});
    }
};

exports.verifyOTP = async(req, res) => {
    const {otp, email, methods} = req.body;
    if(methods === 'login'){
        const exists = await User.findOne({email});
        if(exists){
            if(verifyOTP(email, otp)){
                clearOTP(email);
                const token = jwt.sign({ username: exists.username, email: exists.email }, jwtsecret, { expiresIn: '1h' });
                return res.json({ status: 'success', email: exists.email, username: exists.username, token });
            }
            else{
                return res.json({ status: 'pending', message: 'Invalid OTP' });
            }
        }
        else{
            return res.json({ status: 'failure', message: 'User Not Found! Login First!' });
        }
    }
    else{
        if(verifyOTP(email, otp)){
            clearOTP(email);
            const exists = await User.exists({ email });
            if (exists) return res.json({ status: 'failure', message: 'User already Found! Try Login!' });
            await User.insertOne(waiting);
            const token = jwt.sign({ username: waiting.username, email: waiting.email }, jwtsecret, { expiresIn: '2m' });
            return res.json({ status: 'success', token });
        }
        else{
            return res.json({ status: 'pending', message: 'Invalid OTP' });
        }
    }
};

exports.getUserDetails = async(req, res) => {
    const {username} = req.body;
    try{
        const exists = await User.findOne({ username });
        if(exists){
            return res.json({ status: 'success', details: exists });
        }
        else{
            return res.json({ status: 'failure', message: 'User Not Found!' });
        }
    }
    catch(err){
        return res.json({ status: 'failure', message: err });
    }
};

exports.updateProfile = async(req, res) => {
    const {username, email, mobile} = req.body;
    const exists = await User.findOne({email});
    const image = req.file ? fs.readFileSync(req.file.path) : null;
    if(exists){
        const {password, _id} = exists;
        const newDetails = {username, email, mobile, pic: image, password};
        await User.findByIdAndUpdate(_id, newDetails, { new: true });
        return res.json({status: 'success'});
    }
    else{
        return res.json({status: 'failure', message: 'User Not Found!'});
    }
};

exports.validateToken = async(req,res) => {
    const {token} = req.body;
    try{
        const decoded = jwt.verify(token,jwtsecret);
        return res.json({status: "success",details: {...decoded,token: token}})
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure", message: "Something went Wrong!"})
    }
}