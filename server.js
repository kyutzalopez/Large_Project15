const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config(); // "npm install dotenv" in project root directory for line below to work
const url = process.env.MONGODB_URL; // protected database url

const client = new MongoClient(url);
client.connect();

// Test the connection to the database
client.connect()
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(5001, () => {
            console.log("Server running at http://localhost:5000");
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

//old version
/*app.post('/api/signup', async (req, res, next) => {
      // incoming: login, email, password  
      // outgoing: error
      const { login, password, email } = req.body;
      const newUser= {Username:login, Password:password, Email:email };
      var error = '';
      try
      {
        const db = client.db();
        const result = db.collection('Users').insertOne(newUser);
      }
      catch(e)
      {
        error = e.toString();
      }
      cardList.push( card );
      var ret = { error: error };
      res.status(200).json(ret);
});*/

//new version
app.post('/api/signup', async (req, res, next) => {
      // incoming: email, login, password, repassword
      // outgoing: error
      const { email, login, password, repassword } = req.body;
      const newUser= {Email:email, Username:login, Password:password, UserId:"0" };
      const passMatch = (password === repassword);
      
      var id = -1;
      var e ='';
      var username = '';
      var error = 'Passwords do not match';

      if (passMatch) {    
        try {
            const db = client.db();
            const results = await db.collection('Users').insertOne(newUser);
            const id = results.insertedId;
    
            // Return a single JSON response
            res.status(200).json({
                id: id,            // The user's unique ID
                e: newUser.Email,
                username: newUser.Username,
                error: '',         // No error
            });
        } catch (e) {
            // Handle any errors that occur during the database operation
            const error = e.toString();
            res.status(500).json({ error }); // Send an error response
        }
    }

      Users.push(login);
      var ret = { id: id,  email: e, username: username, error: error};
     
      res.status(200).json(ret);
});

/*app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error

    const { userId, card } = req.body;

    const newCard = { Card: card, UserId: userId };
    var error = '';

    try {
        const db = client.db();
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }

    cardList.push(card);

    var ret = { error: error };
    res.status(200).json(ret);
});
*/
//add movie title to list of movies user has WATCHED
app.post('/api/addmovieWatched', async (req, res, next) => {
    // incoming: userId, title, review, rating
    // outgoing: error
      const { userId, title, review, rating } = req.body;
  
      const newMovie = { Title: title, UserId: userId, Review: review, Rating: rating };
      var error = '';
  
      try {
          const db = client.db();
          const result = db.collection('WatchedMovies').insertOne(newMovie);
      }
      catch (e) {
          error = e.toString();
      }
  
      var ret = { error: error };
      res.status(200).json(ret);
  });

//add title to list of movies user WILL WATCH
app.post('/api/addmovieWatchlist', async (req, res, next) => {
    // incoming: userId, title
    // outgoing: error

    const { userId, title, review, rating } = req.body;

    const newMovie = { Title: title, UserId: userId, Review: review, Rating: rating };
    var error = '';

    try {
        const db = client.db();
        const result = db.collection('Watchlist').insertOne(newMovie);
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

//search watchlist and return movies with partial matching
app.post('/api/searchWatchlist', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db.collection('Watchlist').find({ Title: { $regex: _search + '.*' }, UserId: userId }).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Title);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

//search watched movies and return movies with partial matching
app.post('/api/searchWatched', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db.collection('WatchedMovies').find({ Title: { $regex: _search + '.*' }, UserId: userId }).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Title);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*' } }).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Card);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { login, password } = req.body;

    const db = client.db();
    const results = await db.collection('Users').find({ Username: login, Password: password }).toArray();

    var id = -1;
    var e ='';
    var username = '';
    var error = 'User/Password combination incorrect';


    if (results.length > 0) {
        id = results[0].UserId;
        e = results[0].Email;
        username = results[0].Username;
        error = '';
    }

    var ret = { id: id,  email: e, username: username, error};
    res.status(200).json(ret);
});

app.listen(5000); // start Node + Express server on port 5000
