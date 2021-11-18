//Dependencies
require('dotenv').config();

const {PORT = 2000, MONGODB_URL} = process.env;

const express = require('express');
const app = express();
//import mongoose
const mongoose = require('mongoose');

//import middleware
const cors = require('cors'); //cors headers
const morgan = require('morgan') //logging


//routes & routers
app.get('/', (req, res) => {
    res.send('bookmarks app!!')
})


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})