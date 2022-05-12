const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

//IMPORT ROUTES
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('connected to db')
})


//ROUTES MIDDLEWARES
app.use(express.json())
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);


app.listen('3000', () => {
    console.log("server started");
});