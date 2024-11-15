const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://cop4331:yo5aybgnWmubYS65@cluster0.lamyt.mongodb.net/cop4331?retryWrites=true&w=majority&appName=Cluster0';
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

/*app.post('/api/createUser', async (req, res, next) => {
      // incoming: userId, color
      // outgoing: error
      const { login, password, email } = req.body;
      const newUser= {Username:login, Password:password, Email:email, };
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

app.post('/api/addcard', async (req, res, next) => {
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

app.listen(5000); // start Node + Express server on port 5000