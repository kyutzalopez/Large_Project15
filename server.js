const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');     //"npm instal bcrypt" in root
const fs = require('fs'); //file system
const path = require('path');
const logFilePath = path.join(__dirname, 'log.txt');
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
        app.listen(5000, () => {
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
      // outgoing: id, email, username, error
      const { email, login, password, repassword } = req.body;
      //const newUser= {Email:email, Username:login, Password:password, UserId:"0" }; !!!!!!!
      const passMatch = (password === repassword);
      
      var id = -1;
      var e ='';
      var username = '';
      var error = 'Passwords do not match';

      if (passMatch) {    
        try {
            const db = client.db();
            const loginMatched = await db.collection('Users').find({ Username: login}).toArray();
            if(loginMatched.length > 0) {

                // Return JSON Error: Account already exists
                res.status(418).json({
                    id: id,
                    email: '',
                    username: login,
                    error: 'An account with this login already exists'
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser= {Email:email, Username:login, Password:hashedPassword, UserId:"0" };
            
                //const db = client.db();
                const results = await db.collection('Users').insertOne(newUser);
                const id = results.insertedId;

                //Test Logs
                //console.log(hashedPassword)
                fs.appendFile(logFilePath, 'Sign up, Pass: ' + hashedPassword + '\n', (err) => {});
                fs.appendFile(logFilePath, id + ' - ' + results.Username + '\n\n', (err) => {});
    
                // Return a single JSON response
                res.status(200).json({
                    id: id,            // The user's unique ID
                    email: newUser.Email,
                    username: newUser.Username,
                    error: '',         // No error
                });
            }
            
        } catch (e) {
            // Handle any errors that occur during the database operation
            const error = e.toString();
            res.status(500).json({ error }); // Send an error response
        }
    }else{
      //Passwords do not match      
      var ret = { id: id,  email: e, username: username, error: error};     
      res.status(400).json(ret);
    }
});

app.post('/api/deleteUser', async (req, res, next) => {
    // incoming: login, password
    // outgoing: error
    const {login, password} = req.body;
    
    var error = '';
 
      try {
          const db = client.db();
          const loginMatched = await db.collection('Users').find({ Username: login, Password: password}).toArray();
          if(loginMatched.length <= 0) {

              // Return JSON Error: Not a user
              res.status(418).json({
                  error: 'User with that login and password does not exsist'
              });
          } else {
          
              //const db = client.db();
              await db.collection('Users').deleteOne(loginMatched);
  
              // Return a single JSON response
              res.status(200).json({
                  error: '',         // No error
              });
          }
          
      } catch (e) {
          // Handle any errors that occur during the database operation
          const error = e.toString();
          res.status(500).json({ error }); // Send an error response
      }
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

  //delete a movie a user has WATCHED
  app.post('/api/deletemovieWatched', async (req, res, next) => {
    // incoming: userId, title
    // outgoing: error
      const { userId, title} = req.body;
  
      var error = '';
  
      try {
          const db = client.db();
          const movieToDelete = await db.collection('WatchedMovies').find({ Title: title, UserId: userId }).toArray();
          if(movieToDelete.length <= 0) {
                // Return JSON Error: Not a movie
                res.status(418).json({
                    error: 'Movie does not exsist'
                });
            } else {
                //movie can be deleted
                db.collection('WatchedMovies').deleteOne(movieToDelete);
                //return no error
                var ret = { error: error };
                res.status(200).json(ret);


            }
      }
      catch (e) {
          error = e.toString();
      }
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

//remove title from the WATCH LIST
app.post('/api/deletemovieWatched', async (req, res, next) => {
    // incoming: userId, title
    // outgoing: error
      const { userId, title} = req.body;
  
      var error = '';
  
      try {
          const db = client.db();
          const movieToDelete = await db.collection('Watchlist').find({ Title: title, UserId: userId }).toArray();
          if(movieToDelete.length <= 0) {
                // Return JSON Error: Not a movie
                res.status(418).json({
                    error: 'Movie does not exsist'
                });
            } else {
                //movie can be deleted
                db.collection('Watchlist').deleteOne(movieToDelete);
                //return no error
                var ret = { error: error };
                res.status(200).json(ret);


            }
      }
      catch (e) {
          error = e.toString();
      }
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

    const { login, password } = req.body;

    const db = client.db();
    const results = await db.collection('Users').find({ Username: login}).toArray();

    var id = -1;
    var e ='';
    var username = '';
    var error = 'No user found';

    if (results.length <= 0) {
        var ret = { id: id,  email: e, username: username, error};
        return res.status(400).json(ret);
    }
    try {

        var storedPassword = results[0].Password;
        if(await bcrypt.compare(password, storedPassword)){
            id = results[0]._id;
            e = results[0].Email;
            username = results[0].Username;
            error = '';
        } else {
            error = 'Password is incorrect';
            var ret = { id: id,  email: e, username: username, error};
            return res.status(418).json(ret);
        }
    } catch (e) {
        // Handle any errors that occur during password compare
        const error = e.toString();
        res.status(500).json({ error }); // Send an error response
    }

    var ret = { id: id,  email: e, username: username, error};
    return res.status(200).json(ret);
   
});

//app.listen(5000); // start Node + Express server on port 5000
