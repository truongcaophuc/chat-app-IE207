const express=require("express")
const morgan=require("morgan")
const app=express()
const rateLimit=require("express-rate-limit")
const helmet=require("helmet")
const mongosantize=require("express-mongo-santize")
const bodyParser=require("body-parser")
const xss=require("xss")
const cors=require("cors")
app.use(express.json({limit:"10kb"}))
xssxssapp.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true}))
app.use(helmet())

if(process.env.NODE_ENV=="development"){
    app.use(morgan("dev"))
}
const limiter=rateLimit({
    max:3000,
    windowMs:60*60*1000,
    message:"Too many requests from this IP, please try again in an hour"
})
app.use(express.urlencoded({ extended:true}))
app.use(mongosantize())
app.use(xss())
app.use(cors(
    {
        origin:"*",
        credentials:true,
        methods:["GET","POST","PATCH", "PUT","DELETE"]
    }
))
app.use("/tawk",limiter)

module.exports=app