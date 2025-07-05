const Theatre = require('../Schema/TheatreSchema/TheatreSchema.cjs');
const Movie = require('../Schema/MovieSchema/MovieSchema.cjs');
const Ticket = require('../Schema/TicketSchema/TicketSchema.cjs')
const { Types: { ObjectId } } = require('mongoose');

exports.getTheatres = async(req, res) => {
    try{
        const list = await Theatre.find({});
        return res.json({status: 'success', list});
    }
    catch(err){
        return res.json({status: 'failure', message: err});
    }
};

exports.addTheatre = async(req, res) => {
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
};

exports.removeTheatre = async(req, res) => {
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
};

exports.updateTheatre = async (req, res) => {
    const { theatreDetails } = req.body;
    const { _id, name, screens, max } = theatreDetails;

    if(!_id || !ObjectId.isValid(_id)){
    return res.json({ status: "failure", message: "Invalid or missing Theatre ID!" });
    }
    if(screens.length > max){
    return res.json({
        status: "failure",
        message: "Number of screens exceeds the maximum allowed."
    });
    }
    try{
        const exists = await Theatre.exists({ _id });
        if(!exists){
            return res.json({ status: "failure", message: "Theatre Not Found!" });
        }

        const releasedMovies = await Movie.distinct("title");
        const invalidMovie = screens.find(
            screen => !releasedMovies.includes(screen.currently_showing.movie_name)
        );
        if(invalidMovie){
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
    }
    catch(err){
        console.error(err);
        return res.json({ status: "failure", message: err.message });
    }
};

exports.noOfTheatres = async(req, res) => {
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
};

exports.revenueByTheatre = async(req, res)=>{
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
};
