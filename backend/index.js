const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const routes = require('./routes/route')



const app = express();

// middlewares
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}))
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/jwtauth',{
    useNewUrlParser:true,
    
}).then(()=>{
    console.log("database successfully connected");
    app.listen(5000,()=>{
        console.log('port 5000 chalu');
    })
})
app.use('/api',routes)


