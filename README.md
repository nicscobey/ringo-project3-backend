# ringo-project3-backend

# Team Members
- Nic Scobey - Tech Lead/ Frontend
- Maximillian Rice - Frontend
- Gregorio Moreta - Backend

# Link to application
https://ringo-flashcards.herokuapp.com/api/my/decks

# App Description
>This application is full CRUD functionality. A user can create, read, update, and delete decks and cards. 
The data is stored in a mongo database and is accessed through the route endpoints in the server file. 
When connected to the frontend, the user will have access to all of the cards and decks created by previous users.

>Our application Is a basic single page react app using: 
- Express
- React
- Node.js
- MongoDB
- Postman
- Github
- HTML, CSS, Javascript

# Stretch Goals
>We would have liked to get to:
- User authentication
- Styling

# Dev Dependencies
 
 ```javascript
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "method-override": "^3.0.0",
    "mongoose": "^6.0.12",
    "morgan": "^1.10.0"
  }
 ```

# Database Models

```javascript
// place schema here
const { Schema, model } = require("mongoose");
const mongoose = require("../db/connection");

const cardSchema = new Schema(
  {
    word: {type: String, required: true},
		definition: {type: String, required: true},
		example: String,
		deckTag: {type: String, required: true},
		deckId: {type: Number, required: true}
  },
);

const Card = model("Card", cardSchema);

const deckSchema = new Schema (
	deckTag: string

)

module.exports = Card;
```


# Routing Table
![Alt Text](https://i.imgur.com/B50ekA0.png)
