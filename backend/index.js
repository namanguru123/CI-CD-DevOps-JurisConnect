const express=require("express");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const fileupload=require("express-fileupload");

require("dotenv").config();

const app=express();

app.use(cors(
    {
        origin:["http://localhost:3000"],
        methods:["POST","GET","PUT"],
        credentials:true
    }
));

app.use(express.json());
app.use(cookieParser());

const PORT=process.env.PORT || 4000;

//connect database
require("./config/database").connectDb();

//help in interacting with express js file
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))

//connect to cloudinary
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();

app.get("/",(req,res)=>{
    res.send("Hello Jee");
})

//routes
const user=require("./routes/user");
app.use("/api/v1",user);


app.listen(PORT,()=>{
    console.log(`App is running on the port ${PORT}`);
})