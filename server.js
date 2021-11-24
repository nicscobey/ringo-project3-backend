////////////////////////
//  Dependencies
////////////////////////
//  dotenv gets our env variables
require('dotenv').config();
//  Import express
const express = require('express');
//  Import bcrypt
const bcrypt = require('bcryptjs')
//  Import Json Web Token JWT
const jwt = require('jsonwebtoken')
//  Import cookie parser
const cookieParser = require('cookie-parser')
//  Import mongoose
const mongoose = require('mongoose');
//  Logging
const morgan = require("morgan")
//  cors headers
const cors = require('cors')
//  Allows forms to work properly with delete and put requests
const methodOverride = require('method-override')
//  Import isLoggedIn custom middleware
const { isLoggedIn } = require('./controllers/middleware')
//  Creates the app object
const app = express();
//  Pull the PORT variable from the .env file
const {PORT = 2000, MONGODB_URI} = process.env;

////////////////////////
//  Database Connection
////////////////////////
//  Establish Connection
mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewURLParser: true
})

//  Connection Events
mongoose.connection
.on('open', () => console.log('connected to mongo'))
.on('close', () => console.log('disconnected from mongo'))
.on('error', () => console.log(error))

////////////////////////
//  Database Models
////////////////////////
const cardSchema = new mongoose.Schema(
    {
          word: {type: String, required: true},
          definition: {type: String, required: true},
          example: {type: String, required: true},
          deckTag: {type: String, required: true},
          deckId: {type: String, required: true},
          username: {type: String, required: true}
    }
  );
  
const Card = mongoose.model("Card", cardSchema);
  
const deckSchema = new mongoose.Schema (
    {
      deckTag: {type: String, required: true},
      username: {type: String, required: true}
    }
);

const Deck = mongoose.model("Deck", deckSchema);

const userSchema = new mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true}
    }
)

const User = mongoose.model("User", userSchema)

////////////////////////
//  Middleware
////////////////////////
//  Prevent cors errors
app.use(cors())
//  Logging
app.use(morgan('dev'))
//  Parse JSON bodies
app.use(express.json())
//  Form requests put and delete
app.use(methodOverride('_method'))
//  Parse urlencoded request
app.use(express.urlencoded({extended: true}))
//  Parse the cookies
app.use(cookieParser())

////////////////////////
//  Routes and Routers
////////////////////////
app.get('/', (req, res) => {
    res.send('DICTIONARY APP!!')
})

//  Signup Route - Post request to /api/signup allows a user to be created and stored 
app.post("/api/signup", async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    const user = await User.create(req.body)
    res.json(user)
})

//  Login Route - Post request to /api/login allows a user to sign in
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (user) {
        const result = await bcrypt.compare(req.body.password, user.password)
        if (result) {
            const payload = { username: user.username }
            const token = jwt.sign(payload, process.env.SECRET)
            res
                .cookie('token', token, { httpOnly: true })
                .json({ message: 'loggin successful' })
        } else {
            res.status(400).json({ error: 'password does not match' })
        }
    } else {
        res.status(400).json({ error: 'User Not Found' })
    }
})

//  Index Route - get request to /api/my/decks gets us all the decks
app.get('/api/my/decks', isLoggedIn, async (req, res) => {
    const { username } = req.user 
    try {
        //  Send all decks with that user
        res.json(await Deck.find({ username }))
    } catch(error) {
        //  send error
        res.status(400).json({error})
    }
})

//  Index Route - get request to /api/my/card gets us all the card
app.get('/api/my/card', isLoggedIn, async (req, res) => {
    const { username } = req.user
    try {
        //  Send all decks
        res.json(await Card.find({ username }))
    } catch(error) {
        //  send error
        res.status(400).json({error})
    }
})

//  Create Route - Post request to /api/my/decks creates a deck from json body
app.post("/api/my/decks", isLoggedIn, async (req, res) => {
    const { username } = req.user
    try{
        //  Create a new deck
        res.json(await Deck.create({ username, ...req.body }))
    } catch (error){
        //  Send error message
        res.status(400).json({error})
    }
})

//  Create Route - Post request to /api/my/decks creates a card from a json body
app.post("/api/my/card", isLoggedIn, async (req, res) => {
    const { username } = req.user
    try{
        //  Create a new card
        res.json(await Card.create({ username, ...req.body }))
    } catch(error){
        //  Send error message
        res.status(400).json({error})
    }
})

//  Update Route - Put request to /api/my/decks/:id updates a specified deck
app.put("/api/my/decks/:id", isLoggedIn, async (req, res) => {
    const { username } = req.user
    console.log(req.body)
    try{
        res.json(
            await Deck.findByIdAndUpdate(
                req.params.id, 
                { 
                username, 
                ...req.body, 
                ...{new: true} 
                }
            )
        )
    } catch(error){
        res.status(400).json({error})
    }
})

//  Destroy Route - delete request to /api/my/decks/:id
app.delete("/api/my/decks/:id", isLoggedIn, async (req, res) => {
    try {
        res.json(await Deck.findByIdAndRemove(   
                req.params.id,
            )
        )
    } catch (error) {
        res.status(400).json({error})
    }
})

//  Destroy Route - delete request to /api/my/card/:id
app.delete("/api/my/card/:id", isLoggedIn, async (req, res) => {
    const { username } = req.user
    try {
        res.json(await Card.findByIdAndRemove(
                req.params.id
            )
        )
    } catch (error) {
        res.status(400).json({error})
    }
})

//  Logout Route - destroys session and redirects to home page
app.get('/logout', (req, res) => {
    req.session.destroy((err) =>
    res.redirect('/'))
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})