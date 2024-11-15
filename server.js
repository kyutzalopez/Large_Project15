const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://cop4331:62t9VFsPcmOqOAKb@cluster0.lamyt.mongodb.net/cop4331?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(url);
client.connect();

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


//Example API endpoints

app.post('/api/createUser', async (req, res, next) =>
{
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
});


app.post('/api/login', async (req, res, next) =>
  {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';
    const { login, password } = req.body;
    const db = client.db();
    const results = await
    db.collection('Users').find({Username:login,Password:password}).toArray();
    var id = -1;
    var fn = '';
    var ln = '';
    if( results.length > 0 )
    {
      id = results[0].UserId;
      fn = results[0].FirstName;
      ln = results[0].LastName;
    }
    var ret = { id:id, firstName:fn, lastName:ln, error:''};
    res.status(200).json(ret);
  });

/*function LoggedInName()
{
  var _ud = localStorage.getItem('user_data');
  if(_ud == null) _ud = "";
  var ud = JSON.parse(_ud);
  var userId = ud.id;
  var firstName = ud.firstName;
  var lastName = ud.lastName;
  function doLogout(event:any) : void
  {
    event.preventDefault();
    localStorage.removeItem("user_data")
    window.location.href = '/';
  };
  return(
    <div id="loggedInDiv">
    <span id="userName">Logged In As {firstName} {lastName}</span><br />
    <button type="button" id="logoutButton" className="buttons"
    onClick={doLogout}> Log Out </button>
    </div>
  );
};*/


/*app.post('/api/searchcards', async (req, res, next) =>
{
  // incoming: userId, search
  // outgoing: results[], error
  var error = '';
  const { userId, search } = req.body;
  var _search = search.trim();
  const db = client.db();
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*'}}).toArray();
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});*/

app.listen(5000); // start Node + Express server on port 5000

