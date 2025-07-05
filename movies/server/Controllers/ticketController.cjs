const Ticket = require('../Schema/TicketSchema/TicketSchema.cjs');
const User = require('../Schema/UserSchema/UserSchema.cjs');
const Theatre = require('../Schema/TheatreSchema/TheatreSchema.cjs');
const nodemailer = require('nodemailer');

exports.book = async (req, res) => {
    const details = req.body;
    const {movie,price,screen,seats,theatre,totalPrice,username,showtime} = details;
    console.log(details)
    console.log(username)
    if(username.trim() != '' && seats.length > 0){
        const exists = await User.findOne({username: username})
        console.log(exists)
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
                        html: `Hello, ${username}, You have been successfully booked ${seats.length} tickets for
                        ${movie} at Screen ${screen}.<br/>Please be on time (${details.showTime}) so that you can't miss the show.<br/>
                        You have booked Seat No(s): [ ${seats} ] and have paid <h2>Rs. ${totalPrice}</h2> on ${(new Date().toLocaleDateString())}.<br/>
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
};

exports.history = async (req, res) => {
    const {username} = req.body;
    try{
        const tickets = await Ticket.find({username: username})
        return res.json({status:"success",tickets:tickets})
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message:'Something went Wrong!'})
    }
};

exports.revenueByUser = async (req, res) => {
    const pipeline = [
        {
            $group: {
                _id: "$username",
                spent: { $sum: "$ticketPrice" }
            }
        }
    ]
    try{
        const result = await Ticket.aggregate(pipeline)
        return res.json({status: "success", list: result})
    }
    catch(err){
        console.log(err)
        return res.json({status: "failure", message: "Something Went Wrong!"})
    }
};

exports.getCasters = async (req, res) => {
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
};
