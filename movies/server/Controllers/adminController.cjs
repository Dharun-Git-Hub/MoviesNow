const Admin = require('../Schema/AdminSchema/AdminSchema.cjs');
const {sendEmail} = require('../HelperFunctions/emailHelper.cjs');

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const exists = await Admin.findOne({ email, password });
    if(exists){
        sendEmail(email, 'Adm', process.env);
        return res.json({status: 'success',email: exists.email });
    }
    else{
        return res.json({status: 'failure',message: 'Invalid Credentials' });
    }
};
