// a minimal node app that displays your running processes on the OOD web host
var http      = require('http');
var exec      = require('child_process').exec;
var express   = require('express');
var hbs       = require('hbs');
var path      = require('path');
var baseUri   = process.env.PASSENGER_BASE_URI || '/';


// create routes
var router = express.Router();

router.get("/", function(request, response){
  exec('/usr/local/bin/listbannedipxfer', function(error, stdout, stderr){
    var lines = stdout.toString().replace(/  +/g, ' ').split('\n');
    
    response.render('index', {
      baseUri: baseUri,
      date: new Date(),
      output: lines,
      title: "Banned IPs",
      error: stderr,
      // uncomment if you want to reload:
      // reload: 15
    });
  });
});


var app = express();

// Setup template engine
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('views', path.join(__dirname, 'views'));

app.use(baseUri, router);

app.listen(3000);
