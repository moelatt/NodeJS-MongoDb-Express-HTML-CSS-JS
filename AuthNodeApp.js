const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');
const path = require('path');

const app = express();
const router = express.Router();

// Passport Config
require('./config/passport')(passport);

// Mongo DataBase Config
const database = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(database,{ 
    reconnectTries: 100,
    reconnectInterval: 500,
    autoReconnect: true,
    useNewUrlParser: true,
    dbName: 'test' })
.then(console.log('MongoDB DataBase Connected...'))
.catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/css', express.static('css')) // upload CSS file
app.use('/img', express.static('img')) // upload Images file
app.use('/js', express.static('js')); // upload javaScript file

app.get('/', function(req,res){ // upload HTML file in ejs
    res.sendFile('index.html', {root: path.join(__dirname, '/')});
} )

// Bodyparser
app.use(express.urlencoded({extended: false}))

// Express Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server start it on PORT ${PORT}`))