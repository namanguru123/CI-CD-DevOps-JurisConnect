const mongoose=require("mongoose");
require("dotenv").config();

exports.connectDb=()=>{
    const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI || "mongodb://localhost:27017/instadb";

    console.log("Connecting to MongoDB:", mongoUri);

    mongoose.connect(mongoUri, {
        family: 4, // Use IPv4
    })
    .then(()=>{
        console.log("DB Connected Successfully");
    })
    .catch((error)=>{
        console.log("DB Connection Failed");
        console.log(error);
    });
}
