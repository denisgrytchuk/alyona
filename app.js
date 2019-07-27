const express = require('express');
const path = require('path');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
const nodemailer = require('nodemailer');



//mongoose.connect(config.database);
////mongoose.connect(config.database, { useNewUrlParser: true });
//let db = mongoose.connection;



////Check connection
//db.once('open', function(){
//    console.log('Connected to MongoDB');
//});

////Check for DB errors
//db.on('error', function(err){
//    console.log(err);
//});

const app = express();

//Bring in Modules
let Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


//Express Session MiddLeware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages MiddLeware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();

});

//Express Validator MiddLware

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };

    }
}));

//Passport Config
require('./config/passport')(passport);
// Passport MiddLeware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});


//Home Route
app.get('/', function(req, res) {
  
            res.render('index',{
                title:'Happy birthday'
              
            });

});



//Route Files
let articles = require('./router/article');
let users = require('./router/user');
app.use('/articles',articles);
app.use('/users',users);


//Start Server
app.listen(3000, function () {
    console.log('Server started on port 3000...');
});