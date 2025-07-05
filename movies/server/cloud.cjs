const cloudinary = require('cloudinary')
const express = require('express')
const multer = require('multer')
const PORT = 3002
require('dotenv').config()
const app = express()

app.use(express.json())

const upload = multer({dest: 'upload/'})

app.post('/uploadToCloud',upload.single('image'),async(req,res)=>{
    cloudinary.config({
        cloud_name: process.env.cloudname, 
        api_key: process.env.apikey, 
        api_secret: process.env.apisecret,
    });
    try{
        const response = await cloudinary.uploader.upload(req.file.path)
        console.log(response)
        return res.json({status:"success",url: response.url})
    }
    catch(err){
        console.log(err)
        return res.json({status:"failure",message: "Error"})
    }
})

app.listen(PORT)