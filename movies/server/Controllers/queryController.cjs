const Query = require('../Schema/QuerySchema/QuerySchema.cjs');

exports.placeQuery = async(req, res) => {
    const {username, query} = req.body;
    try{
        await Query.insertOne({username, query, resolved: false, date: new Date()});
        return res.json({status: 'success'});
    }
    catch(err){
        return res.json({status: 'failure', message: 'Something went Wrong!'});
    }
};

exports.getQueries = async(req, res) => {
    try{
        const queries = await Query.find();
        return res.json({status: 'success', list: queries});
    }
    catch(err){
        return res.json({status: 'failure', message: 'Something went Wrong!'});
    }
};

exports.setResolved = async(req, res) => {
    const {id} = req.body;
    try{
        const exists = await Query.findOne({ _id: id });
        if (!exists) {
            return res.json({ status: 'failure', message: 'User Not Found!' });
        }
        await Query.updateOne(
            {_id: id},
            { $set: { resolved: true, resolvedOn: new Date() }},
            { new: true }
        )
        return res.json({status: 'success', id});
    }
    catch(err){
        return res.json({status: 'failure', message: 'Something went Wrong!'});
    }
};
