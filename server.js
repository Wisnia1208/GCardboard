var express         = require('express');
var app             = express();
var PORT            = process.env.PORT || 8080;
var server          = app.listen(PORT,() => console.log(`Listening on ${ PORT }`));
const cors = require('cors');
app.use(cors());
app.use(express.static(__dirname + '/index/'));

//If you have problem witch CORS, you can run NodeJS server with your application
// But then you need to install NodeJS https://nodejs.org/en/

// Start this small application by command:
//npm install 
//then:
//node server.js

// copy your app to directory "index" 