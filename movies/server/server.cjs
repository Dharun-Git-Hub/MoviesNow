const express = require('express')
const PORT = 3000
const app = express()
const multer = require('multer')
const bcrypt = require('bcrypt')
const cors = require('cors')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtsecret = process.env.jwtsecret
const uri = process.env.uri
const Theatre = require('./Schema/TheatreSchema/TheatreSchema.cjs')
const Ticket = require('./Schema/TicketSchema/TicketSchema.cjs')
const Movie = require('./Schema/MovieSchema/MovieSchema.cjs')
const Admin = require('./Schema/AdminSchema/AdminSchema.cjs')
const User = require('./Schema/UserSchema/UserSchema.cjs')
const Query = require('./Schema/QuerySchema/QuerySchema.cjs')
app.use(cors())
app.use(express.json())

mongoose.connect(uri)
.then(()=>console.log('MongoDB Connected!'))
.catch((err)=>console.log(err))

const upload = multer({ dest: 'upload/' })

const otpstore = {}
let waiting;
let otp;

const generateOTP = (email) => {
    otp = Math.floor(Math.random() * (10000-1000) + 1000)
    otpstore[email] = otp;
}

const trackOTP = (email) => {
    console.log(otpstore)
    setTimeout(()=>{
        delete otpstore[email]
    },180000)
}

const sendEmail = async (email,username) => {
    let usr = username !== "Adm" ? username : "Admin";
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mailuser,
            pass: process.env.mailpass,
        },
    })
    generateOTP(email)
    const mailOptions = {
        from: process.env.mailuser,
        to: email,
        subject: "3 Minutes OTP from Movies...",
        text: `${usr}, Your OTP for Movies is ${otp} only valid for 3 Minutes! Hurry up!...`
    }
    transporter.sendMail(mailOptions,(err)=>{
        if(err){
            console.log(err)
        }
    })
    trackOTP(email)
}

app.post('/signupEmail',upload.single('image'), async (req,res)=>{
    const {username,email,password,mobile} = req.body;
    console.log(username)
    const image = req.file ? fs.readFileSync(req.file.path) : null
    console.log(image)
    const exists = await User.findOne({email: email})
    if(!exists){
        try{
            waiting = {
                username: username,
                password: password,
                email: email,
                mobile: mobile,
                pic: image,
            }
            sendEmail(email,username)
            fs.unlinkSync(req.file.path)
            return res.json({status: "success", email: email, username: username})
        }
        catch(err){
            fs.unlinkSync(req.file.path)
            console.log(err)
            return res.json({status: "failure", message: "User Already Found"})
        }
    }
    else{
        fs.unlinkSync(req.file.path)
        return res.json({status: "failure", message: "User Already Found"})
    }
})

app.post('/validateEmail', async (req,res)=>{
    const {email,password} = req.body;
    const exists = await User.findOne({email: email})
    if(exists){
        if(exists.password === password){
            sendEmail(exists.email,exists.username)
            return res.json({status: "success", email: exists.email, username: exists.username})
        }
        else{
            return res.json({status: "failure", message: "Invalid Credentials"})
        }
    }
    else{
        return res.json({status: "failure", message: "No Users Found! Signup first!"})
    }
})

app.post('/verifyOTP',async(req,res)=>{
    const {otp,email,methods} = req.body;
    if(methods === 'login'){
        const exists = await User.findOne({email: email})
        if(exists){
            if(otpstore[email] === Number(otp)){
                delete otpstore[email]
                console.log(otpstore)
                const token = jwt.sign({username:exists.username,email:exists.email},jwtsecret,{expiresIn:"1h"});
                return res.json({status: "success",email: exists.email, username: exists.username, token: token})
            }
            else{
                return res.json({status: "pending", message: "Invalid OTP"})
            }
        }
        else{
            return res.json({status: "failure", message: "User Not Found! Login First!"})
        }
    }
    else{
        if(otpstore[email] === Number(otp)){
            delete otpstore[email]
            console.log(otpstore)
            const exists = await User.exists({email:email})
            if(exists)
                return res.json({status:"failure",message: "User already Found! Try Login!"})
            await User.insertOne(waiting)
            const token = jwt.sign({username: waiting.username, email: waiting.email},jwtsecret,{expiresIn: "2m"})
            return res.json({status: "success", token: token})
        }
        else{
            return res.json({status: "pending", message: "Invalid OTP"})
        }
    }
})

app.post('/adminLogin',async(req,res)=>{
    const {email,password} = req.body;
    const exists = await Admin.findOne({email: email, password: password});
    if(exists){
        sendEmail(email,"Adm")
        return res.json({status: "success", email: exists.email})
    }
    else{
        return res.json({status: "failure", message: "Invalid Credentials"})
    }
})

app.post('/getUserDetails',async(req,res) => {
    const {username} = req.body;
    try{
        const exists = await User.findOne({username:username})
        if(exists){
            return res.json({status:"success",details: exists})
        }
        else{
            return res.json({status:"failure",message:"User Not Found!"})
        }
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message:err})
    }
})

app.post('/updateProfile',upload.single('image'),async(req,res) => {
    const {username,email,mobile,pic} = req.body;
    const exists = await User.findOne({email:email})
    const image = req.file? fs.readFileSync(req.file.path) : null
    if(exists){
        const {password,_id} = exists
        const newDetails = {
            username,
            email,
            mobile,
            pic: image,
            password,
        }
        const updated = await User.findByIdAndUpdate(_id,newDetails,{new: true})
        console.log(updated)
        return res.json({status:'success'})
    }
    else{
        return res.json({status:'failure',message:'User Not Found!'})
    }
})

app.get('/movies',async(req,res)=>{
    try{
        const list = await Movie.find({});
        return res.json({status: "success", list: list})
    }
    catch(err){
        return res.json({status: "failure", message: err})
    }
})

app.get('/theatres',async(req,res)=>{
    try{
        const list = await Theatre.find({})
        return res.json({status: "success", list: list})
    }
    catch(err){
        console.log(err)
        return res.json({status: "failure", message: err})
    }
})

app.post('/addTheatre',async(req,res)=>{
    const {theatreDetails} = req.body;
    console.log(theatreDetails)
    const {name,screens,max} = theatreDetails
    if (screens.length > max) {
        return res.json({status: "failure", message: "Number of screens exceeds the maximum allowed"});
    }
    const pipeline = [
        {
            $group: {
                _id: "$title"
            }
        },
        {
            $project: {
                _id: 0,
                title: "$_id"
            }
        }
    ]
    const result = await Movie.aggregate(pipeline)
    console.log(result)
    const moviesList = []
    result.map((el)=>{
        moviesList.push(el.title)
    })
    console.log(moviesList)
    let goAhead = true;
    theatreDetails.screens.map((screen)=>{
        const exist = moviesList.find((el)=>el===screen.currently_showing.movie_name)
        if(!exist){
            console.log('Movie Not Released Yet!')
            goAhead = false;
            return res.json({status: "failure", message: "Movie Not Released yet!"})
        }
    })
    if(goAhead===false)
        return res.json({status: "failure", message: "Some of the Movie(s) you entered Not Released yet!"})
    try{
        await Theatre.insertOne(theatreDetails)
        console.log(`Theatre (${name}) Created!`)
        return res.json({status: "success", message: "Theatre Created"})
    }
    catch(err){
        console.log(err)
        return res.json({status: "failure", message: err})
    }
})

app.post('/addMovie',async(req,res)=>{
    const {movieDetails,theatres} = req.body;
    const {title} = movieDetails;console.log(title)
    try{
        const exists = await Movie.exists({title: title});
        if(exists){
            return res.json({status: "failure", message: "Movie Already Found!"})
        }
        const newMovie = await Movie.insertOne(movieDetails,{new: true})
        if(theatres.length > 0){
            const exists = await Theatre.exists({name: { $in: theatres }})
            if(exists){
                const spots = await Theatre.find({name: { $in: theatres }})
                spots.map((spot)=>{
                    spot.screens.push(
                        {
                            currently_showing: {
                                movie_name: title
                            }
                    })
                })
                spots.map((el)=>console.log(el))
                spots.map(async(spot)=>{
                    await Theatre.findByIdAndUpdate(spot.id,spot)
                })
            }
        }
        return res.json({status: "success", message: "Movie Released!"});
    }
    catch(err){
        console.log(err)
        return res.json({status: "failure", message: "Something went Wrong"})
    }
})

app.post('/removeTheatre',async(req,res)=>{
    const {name} = req.body;
    try{
        const exists = await Theatre.exists({name: name})
        if(!exists){
            return res.json({status: "failure", message: "Theatre Not Found!"})
        }
        await Theatre.deleteOne({name: name});
        return res.json({status: "success", message: "Theatre Removed!"})
    }
    catch(err){
        return res.json({status: "failure", message: err})
    }
})

app.post('/removeMovie',async(req,res)=>{
    const {movieDetails: title} = req.body;
    console.log(title)
    try{
        const exists = await Movie.exists({title: title})
        if(!exists){
            return res.json({status: "failure", message: "Movie Not Found!"})
        }
        await Movie.deleteOne({title: title})
        const updated = await Theatre.updateMany(
            {},
            { $pull: {
                screens: {
                    "currently_showing.movie_name": title,
                },
            }}
        )
        console.log(updated)
        return res.json({status: "success"})
    }
    catch(err){
        console.log(err)
        return res.json({status: "failure", message: err})
    }
})

const { Types: { ObjectId } } = mongoose;

app.put('/updateTheatre', async (req, res) => {
    const { theatreDetails } = req.body;

    const { _id, name, screens, max } = theatreDetails;

    if (!_id || !ObjectId.isValid(_id)) {
    return res.json({ status: "failure", message: "Invalid or missing Theatre ID!" });
    }

    if (screens.length > max) {
    return res.json({
        status: "failure",
        message: "Number of screens exceeds the maximum allowed."
    });
    }

    try {
    const exists = await Theatre.exists({ _id });
    if (!exists) {
        return res.json({ status: "failure", message: "Theatre Not Found!" });
    }

    const releasedMovies = await Movie.distinct("title");
    const invalidMovie = screens.find(
        screen => !releasedMovies.includes(screen.currently_showing.movie_name)
    );
    if (invalidMovie) {
        return res.json({
        status: "failure",
        message: `Movie "${invalidMovie.currently_showing.movie_name}" is not released yet!`
        });
    }

    const updated = await Theatre.findByIdAndUpdate(
        _id,
        theatreDetails,
        { new: true }
    );

    console.log("Updated:", updated);
    return res.json({ status: "success", message: "Theatre Updated" });

    } catch (err) {
    console.error(err);
    return res.json({ status: "failure", message: err.message });
    }
});


app.post('/updateMovie',async(req,res)=>{
    const {movieDetails} = req.body;
    try{
        console.log(movieDetails)
        const exists = await Movie.exists({_id: movieDetails._id})
        if(!exists){
            return res.json({status: "failure", message: "Movie Not Found!"})
        }
        try{
            const id = movieDetails._id;
            const updatedMovie = await Movie.findByIdAndUpdate(id,movieDetails,{new: true})
            console.log(updatedMovie);
            return res.json({status: "success", message: "Movie Updated"})
        }
        catch(err){
            return res.json({status: "failure", message: err})
        }
    }
    catch(err){
        return res.json({status: "failure", message: err})
    }
})

app.post('/getCasters',async (req,res) => {
    const {movie} = req.body;
    const pipeline = [
        { $unwind: "$screens" },
        { $match: { "screens.currently_showing.movie_name": movie.title } },
        {
            $project: {
                _id: 0,
                theatre: "$name",
                movie: "$screens.currently_showing.movie_name",
                screen_number: "$screens.screen_number",
                capacity: "$screens.seating_capacity",
                price: "$screens.currently_showing.price",
                showtimes: "$screens.currently_showing.showtimes",
            }
        }
    ];
    const casters = await Theatre.aggregate(pipeline)
    console.log(casters)
    if(casters.length>0){
        return res.json({status: "success", list: casters})
    }
    return res.json({status: "failure",message: "Not Casting Yet!"})
})

app.post('/book',async (req,res) => {
    const details = req.body;
    const {movie,price,screen,seats,theatre,totalPrice,username,showtime} = details;
    console.log(details)
    if(username.trim() != '' && seats.length > 0){
        const exists = await User.findOne({username: username})
        if(exists){
            const newTicket = {
                username,
                email: exists.email,
                theatre,
                movie,
                screen,
                ticketPrice: price,
                no: seats.length,
                seats,
                payable: totalPrice,
                showTime: new Date(details.showTime),
                bookedDate: new Date,
            }
            console.log(`New Ticket: ${newTicket}`)
            try{
                await Ticket.insertOne(newTicket)
                try{
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.mailuser,
                            pass: process.env.mailpass,
                        }
                    })
                    const mailOptions = {
                        from: 'ganeshgowri1985@gmail.com',
                        to: exists.email,
                        subject: '😍 Booked Successfully',
                        text: `Hello, ${username}, You have been successfully booked ${seats.length} tickets for
                        ${movie} at Screen ${screen}.\nPlease be on time (${details.showTime}) so that you can't miss the show.\n
                        You have booked Seat No(s): [${seats}] and have paid Rs. ${totalPrice} on ${(new Date()).toLocaleDateString()}.\n
                        Happy Show!...❤️`,
                    }
                    await transporter.sendMail(mailOptions,(err)=>{
                        if(err)
                            console.log(err)
                    })
                }
                catch(err){
                    console.log(err)
                }
                return res.json({status:"success",message:"Ticket booked Successfully!"})
            }
            catch(err){
                console.log(err)
                return res.json({status:"failure",message:"Something went Wrong!"})
            }
        }
        else{
            return res.json({status:"failure",message:`Signup first to continue!`})
        }
    }
})

app.get('/noOfTheatres',async(req,res) => {
    const pipeline1 = [
        {
            $group: {
                _id: null,
                count: { $sum: 1 }            
            }
        }
    ]
    const noOfTheatres = await Theatre.aggregate(pipeline1)
    const pipeline2 = [
        {
            $group: {
                 _id: null,
                 count: { $sum: 1 },
            }
        }
    ]
    const noOfMovies = await Movie.aggregate(pipeline2)
    const pipeline3 = [
        {
            $group: {
                _id: "$name"
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id"
            }
        }
    ]
    const list1 = await Theatre.aggregate(pipeline3)
    const theatresList = []
    list1.map((el)=>theatresList.push(el.name))
    const pipeline4 = [
        {
            $group: {
                _id: "$title"
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id"
            }
        }
    ]
    const list2 = await Movie.aggregate(pipeline4)
    const moviesList = []
    list2.map((el)=>moviesList.push(el.name))
    const pipeline5 = [
        {
            $unwind: "$screens"
        },
        {
            $group: {
                _id: "$screens.currently_showing.movie_name",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                movie: "$_id",
                count: 1,
            }
        }
    ]
    const castingCount = await Theatre.aggregate(pipeline5)
    const pipeline = [
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ]
    const ticketsCount = await Ticket.aggregate(pipeline)
    const pipelineT = [
        {
            $project: {
                _id: 0,
                theatre: "$name",
                casting: { $cond: { if: { $isArray: "$screens"}, then: { $size: "$screens"}, else: 0}}
            }
        },
    ]
    const theatreCasting = await Theatre.aggregate(pipelineT)
    const shows = new Map()
    await Promise.all(
        theatreCasting.map(async (el) => {
            const theatres = await Theatre.find({ name: el.theatre });
            theatres.forEach((theatre) => {
                let showsArray = [];
                theatre.screens.forEach((screen) => {
                    showsArray.push(screen.currently_showing.movie_name);
                });
                shows.set(theatre.name, showsArray);
            });
        })
    );
    const result = {
        theatresCount: noOfTheatres[0].count,
        moviesCount: noOfMovies[0].count,
        theatresList: theatresList,
        moviesList: moviesList,
        castingCount: castingCount,
        theatreCasting: theatreCasting,
        ticketsCount: ticketsCount[0].count,
        showsList: Object.fromEntries(shows),
    }
    return res.json({status:"success",details:result})
})

app.get('/whereAreCasting',async(req,res) => {
    const aggr = async (movie) => {
        const pipeline = [
            {
                $lookup: {
                    from: "theatres",
                    localField: "title",
                    foreignField: "screens.currently_showing.movie_name",
                    as: "related"
                }
            },
            {
                $unwind: "$related"
            },
            {
                $match: {
                    "title": movie
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    theatres: "$related.name"
                }
            },
            {
                $group: {
                    _id: "$title",
                    theatres: { $push: "$theatres" }
                }
            }
        ]
        const result = await Movie.aggregate(pipeline)
        console.log(result)
        return result
    }
    const moviesCasting = new Map()
    const pipeline4 = [
        {
            $group: {
                _id: "$title"
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id"
            }
        }
    ]
    try{
        const list2 = await Movie.aggregate(pipeline4)
        const moviesList = []
        list2.map((el)=>moviesList.push(el.name))
        console.log(list2)
        await Promise.all(
                moviesList.map(async(movie)=>{
                    let temp = (await aggr(movie))[0]
                    console.log(temp)
                    moviesCasting.set(temp._id,temp.theatres)
            })
        )
        const result = Object.fromEntries(moviesCasting)
        res.json({status: "success", data: result})
    }
    catch(err){
        console.log(err)
        return res.json({status: "failure", message: err})
    }
})

app.get('/revenueByMovie',async(req,res)=>{
    const pipeline = [
        {
            $project: {
                movie: 1,
                payable: 1,
                no: 1,
            }
        },
        {
            $group: {
                _id: "$movie",
                revenue: { $sum: "$payable" },
                seats: { $sum: "$no" }
            }
        }
    ]
    const result = await Ticket.aggregate(pipeline)
    console.log(result)
    return res.json({status:"success",result:result})
})

app.get('/revenueByTheatre', async(req,res) => {
    const pipeline = [
        {
            $project: {
                theatre: 1,
                payable: 1,
                no: 1,
            }
        },
        {
            $group: {
                _id: "$theatre",
                revenue: { $sum: "$payable" },
                seats: { $sum: "$no" }
            }
        }
    ]
    const result = await Ticket.aggregate(pipeline)
    console.log(result)
    return res.json({status:"success",result:result})
})

app.post('/history',async(req,res)=>{
    const {username} = req.body;
    try{
        const tickets = await Ticket.find({username: username})
        return res.json({status:"success",tickets:tickets})
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message:'Something went Wrong!'})
    }
})

app.post('/validateToken',async(req,res)=>{
    const {token} = req.body;
    try{
        const decoded = jwt.verify(token,jwtsecret);
        console.log(decoded)
        return res.json({status: "success",details: {...decoded,token: token}})
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure", message: "Something went Wrong!"})
    }
})

app.post('/placeQuery',async(req,res)=>{
    const {username,query} = req.body;
    try{
        await Query.insertOne({username: username, query: query, resolved: false, date: new Date()})
        return res.json({status:"success"})
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message:"Something went Wrong!"})
    }
})

app.get('/getQueries',async(req,res)=>{
    try{
        const queries = await Query.find()
        console.log(queries)
        return res.json({status: "success", list: queries});
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message:"Something went Wrong!"})
    }
})

app.patch('/setResolved',async(req,res) => {
    const {id} = req.body;
    console.log(id)
    try{
        const exists = await Query.findOne({_id:id})
        if(!exists){
            return res.json({status:"failure",message:"User Not Found!"})
        }
        const updated = await Query.updateOne({_id:id},{$set: {resolved:true, resolvedOn: new Date()}},{new:true})
        console.log(updated)
        return res.json({status:"success",id: id});
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message:"Something went Wrong!"})
    }
})

app.listen(PORT,()=>{
    console.log(`Server Running @Port: ${PORT}`)
})