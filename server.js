// require('dotenv').config();

// const express = require('express');
// const app = express();
// const {PORT = 2000} = process.env

// //routes & routers
// app.get('/', (req, res) => {
//     res.send('this is a flashcards app')
// })

// app.listen(PORT, () => {
//     console.log(`listening on ${PORT}`)
// })


//Dependencies
require('dotenv').config();

const {PORT = 3000, MONGODB_URL} = process.env;

const express = require('express');
const app = express();
//import mongoose
const mongoose = require('mongoose');

//import middleware
const cors = require('cors'); //cors headers
const morgan = require('morgan') //logging

//establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on('open', ()=> {console.log('yay a mongo!')})
.on('close', ()=> {console.log('bye, Mongo!')})
.on('error', (error) => {console.log(error)})

//MODELS
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema);

//USE MIDDLEWARE
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())

//routes & routers
app.get('/', (req, res) => {
    res.send('happy turkey day!')
})


//index
app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch (error) {
        //send error
        res.status(400).json({error})
    }   
})

//create 
app.post('/people', async (req, res) => {
    try {
       res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json({error})
    }
})

//delete
app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})

//update
app.put('/people/:id', async (req, res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json({error})
    }
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})