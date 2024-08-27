const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors')
const connectToDB = require('./db/db_Conn');
const userRoute = require('./route/users');
const authRoute = require('./route/auth');
const postRoute = require('./route/posts');



const app = express();
dotenv.config()
connectToDB()

//Middleware
app.use(cors())
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get('/',(req, res)=>{
    res.json("Hello")
})
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(8800, ()=>{
    console.log('Server is running...')
})