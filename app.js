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
  exec('/usr/local/bin/inventory', function(error, stdout, stderr){
    var lines = stdout.toString().replace(/  +/g, ' ').split('\n');

    var dict = {};
    
    for(i = 1; i < lines.length - 4; i++) {
        node = lines[i].replace(/\s+/g, ' ').split(' ')[0];
        node = node.slice(0,-2);
        
        if (node[node.length - 1] == "0") {
            node = node.slice(0,-1);
        }

        if (dict[node] === null|| dict[node] === undefined) {
            dict[node] = 1;
        } else {
            dict[node]++;
        }
    }
    
    var vals = Object.keys(dict).map(function(key) {
        return dict[key];
    });
    
    response.render('index', {
      baseUri: baseUri,
      date: new Date(),
      output: lines,
      title: "Inventory",
      error: stderr,
      nodes: Object.keys(dict),
      counts: vals
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
