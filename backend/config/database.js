const mongoose=require("mongoose");
require("dotenv").config();

exports.connectDb=()=>{
    mongoose.connect("mongodb://mongo:27017/instadb")
    .then(()=>{
        console.log("DB Connected Successfully");
    })
    .catch((error)=>{
        console.log("DB Connection Failed");
        console.log(error);
    });
}
