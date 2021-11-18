require('dotenv').config();

const express = require('express');
const app = express();
const {PORT = 2000} = process.env

//routes & routers
app.get('/', (req, res) => {
    res.send('this is a flashcards app')
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})