var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var quesController = require('./controller/quesController.js');
var session = require('express-session')

var app = express();

function addCustomViewHelpers(req, res, next){
    /**
     * Escapes the data for use in a quoted JavaScript data value.
     * @param data
     * @returns {*}
     */
    res.locals.escapeForJavaScript = function (data) {
        if (typeof data !== 'string') {
            return data;
        }
        // <%= %> will HTML-escape <, >, and ", but not '. So it is vulnerable to XSS when used in JavaScript.
        // Escape the ' and " with their hex values.
        return data.replace(/'/g, '\\x27').replace(/"/g, '\\x22');
    };
    next();
}

function addConfig(){
    res.local.config = config;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(addCustomViewHelpers);
app.use(session({
    secret: 'bonWebServer',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
    secret: 'bonbonWebServer'
    })
);

app.use('/public', express.static(__dirname + '/public'));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', quesController.getQuestionInitialPage);
app.get('/initial', quesController.getQuestionInitialPage);
app.get('/data/category/:category/questions', quesController.getQuestionData);
app.get('/data/category/:category/question/:qID', quesController.getQuestionDataFromID);
app.post("/data/question/:qid/:action", quesController.updateQuestionRate);


app.listen(4000);
console.log('app is listening at localhost:4000');

module.exports = app;
