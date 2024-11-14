const databaseURL = "mongodb+srv://cop4331:62t9VFsPcmOqOAKb@cluster0.lamyt.mongodb.net/cop4331?retryWrites=true&w=majority&appName=Cluster0"

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) =>
{
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

app.listen(5000); // start Node + Express server on port 5000



//Example API endpoints

app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error
  var error = '';
  const { userId, card } = req.body;
  // TEMP FOR LOCAL TESTING.
  cardList.push( card );
  var ret = { error: error };
  res.status(200).json(ret);
});


app.post('/api/login', async (req, res, next) =>
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  var error = '';
  const { login, password } = req.body;
  var id = -1;
  var fn = '';
  var ln = '';
  if( login.toLowerCase() == 'bob' && password == 'COP4331' )
  {
    id = 1;
    fn = 'Bob';
    ln = 'Roberts';
  }
  else
  {
    error = 'Invalid user name/password';
  }
  var ret = { id:id, firstName:fn, lastName:ln, error:error};
  res.status(200).json(ret);
});


app.post('/api/searchcards', async (req, res, next) =>
{
  // incoming: userId, search
  // outgoing: results[], error
  var error = '';
  const { userId, search } = req.body;
  var _search = search.toLowerCase().trim();
  var _ret = [];
  for( var i=0; i<cardList.length; i++ )
  {
    var lowerFromList = cardList[i].toLocaleLowerCase();
    if( lowerFromList.indexOf( _search ) >= 0 )
    {
      _ret.push( cardList[i] );
    }
  }
  var ret = {results:_ret, error:''};
  res.status(200).json(ret);
});

