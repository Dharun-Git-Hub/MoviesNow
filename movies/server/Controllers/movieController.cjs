const Movie = require('../Schema/MovieSchema/MovieSchema.cjs');
const Theatre = require('../Schema/TheatreSchema/TheatreSchema.cjs');

exports.getMovies = async (req, res)=>{
    try{
        const list = await Movie.find({});
        return res.json({ status: 'success', list });
    }
    catch(err){
        return res.json({ status: 'failure', message: err });
    }
};

exports.addMovie = async (req, res)=>{
    const { movieDetails, theatres } = req.body;
    const { title } = movieDetails;
    try{
        const exists = await Movie.exists({title});
        if(exists){
            return res.json({status: 'failure', message: 'Movie Already Found!'});
        }
        await Movie.insertOne(movieDetails,{ new: true });
        if(theatres.length > 0){
            const exists = await Theatre.exists({name: { $in: theatres }});
            if(exists){
                const spots = await Theatre.find({name: { $in: theatres }});
                spots.map((spot) => {
                    spot.screens.push({currently_showing: { movie_name: title }});
                });
                spots.map(async (spot) => {
                    await Theatre.findByIdAndUpdate(spot.id, spot);
                });
            }
        }
        return res.json({status: 'success', message: 'Movie Released!'});
    }
    catch(err){
        return res.json({status: 'failure', message: 'Something went Wrong'});
    }
};

exports.removeMovie = async (req, res) => {
    const { movieDetails: title } = req.body;
    try{
        const exists = await Movie.exists({ title });
        if(!exists){
            return res.json({status: 'failure', message: 'Movie Not Found!'});
        }
        await Movie.deleteOne({ title });
        await Theatre.updateMany({}, { $pull: { screens: { 'currently_showing.movie_name': title } } });
        return res.json({status: 'success'});
    }
    catch(err){
        return res.json({status: 'failure', message: err});
    }
};

exports.updateMovie = async (req, res) => {
    const { movieDetails } = req.body;
    try{
        const exists = await Movie.exists({_id: movieDetails._id});
        if(!exists){
            return res.json({status: 'failure', message: 'Movie Not Found!'});
        }
        await Movie.findByIdAndUpdate(movieDetails._id, movieDetails,{new: true});
        return res.json({status: 'success', message: 'Movie Updated'});
    }
    catch(err){
        return res.json({status: 'failure', message: err});
    }
};

exports.revenueByMovie = async (req, res) => {
    const Ticket = require('../Schema/TicketSchema/TicketSchema.cjs');
    const pipeline = [
        {
            $project: {
                movie: 1,
                payable: 1,
                no: 1
            }
        },
        {
            $group: {
                _id: '$movie',
                revenue: { $sum: '$payable' },
                seats: { $sum: '$no' }
            }
        }
    ];
    const result = await Ticket.aggregate(pipeline);
    return res.json({ status: 'success', result });
};

exports.whereAreCasting = async (req, res) => {
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
};
