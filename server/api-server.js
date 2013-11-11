/**
 * A simple unifile server to expose unifile api and nothing else
 * https://github.com/silexlabs/unifile/
 * license: GPL v2
 */
// node modules
var express = require('express');
var app = express();
var unifile = require('unifile');

// config
var options = unifile.defaultConfig;

// change www root
options.www.root = "../../../../www";

// silex backend
app.use('/silex/tasks', express.bodyParser());
app.use('/silex/tasks', express.cookieParser());
app.use('/silex/tasks', express.cookieSession({ secret: 'plum plum plum'}));

app.post('/silex/tasks/:task', function(req, res, next){
    var silexTasks = require('./silex-tasks.js');
    silexTasks.route(function(result){
        console.log('silex task result', result);
        if (!result) result = {success:true};
        res.send(result);
    }, req, res, next, req.params.task);
});

/* */
// DEBUG ONLY
// define users (login/password) wich will be authorized to access the www folder (read and write)
options.www.users = {
    "admin": "admin"
}
/* */
// add static folders
options.staticFolders.push(
    // file browser
    {
            name: "/cloud-explorer",
            path: "../../../../cloud-explorer/lib/"
    },
    // silex main site
    {
        path: "../../../../www/"
    },
    // silex editor
    {
        name: "/silex",
        path: "../../../../bin/"
    },
    // debug silex
    {
        name: "/src",
        path: "../../../../src/"
    },
    {
        name: "/build",
        path: "../../../../build/"
    }
);

// use unifile as a middleware
var unifileMiddleware = unifile.middleware(express, app, options);
app.use(unifileMiddleware);

// server 'loop'
var port = process.env.PORT || 6805; // 6805 is the date of sexual revolution started in paris france 8-)
app.listen(port, function() {
  console.log('Listening on ' + port);
});

/* */
// PRODUCTION ONLY
// catch all errors and prevent nodejs to crash, production mode
process.on('uncaughtException', function(err) {
    console.log  ('---------------------');
    console.error('---------------------', 'Caught exception: ', err, '---------------------');
    console.log  ('---------------------');
});
/* */