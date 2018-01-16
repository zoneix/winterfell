require('dotenv').config();

var express = require("express"),
    http = require ('http'),
    https = require ('https'),
    fs = require ('fs');

var app = express();
var router = express.Router();
//var path = __dirname + '/greyscale/';
var path = __dirname + '/'+ process.env.TEMPLATE +'/';
var path2 = __dirname + '/Moderna/';

var passport = require('passport'),
    _ = require('lodash'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    util = require('util'),
    CiscoSparkStrategy = require('passport-cisco-spark').Strategy;


//---------------------------------------------------------------------------
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Cisco Spark profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    //console.log('\n serializeUser output' + user);
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    //console.log('\n DE-serializeUser output' + JSON.stringify(obj));
    done(null, obj);
});

// Use the SparkStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Spark
//   profile), and invoke a callback with a user object.
passport.use(new CiscoSparkStrategy({
        clientID: process.env.CISCO_SPARK_CLIENT_ID,
        clientSecret: process.env.CISCO_SPARK_CLIENT_SECRET,
        callbackURL: "https://test.bigbrainpan.com/auth/spark/callback",
        scope: [
            'spark:people_read'
            //'spark:rooms_read',
            //'spark:rooms_write',
            //'spark:memberships_read',
            //'spark:memberships_write',
            //'spark:messages_read',
            //'spark:messages_write',
            //'spark:teams_read',
            //'spark:teams_write',
            //'spark:team_memberships_read',
            //'spark:team_memberships_write'
        ]
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("Received access token : " + accessToken);
        console.log("Received refresh token : " + refreshToken);
        //console.log("Received profile : " + JSON.stringify(profile));
        ///// - globally sets!!! app.set('UserToken', accessToken);
        //process.nextTick(function (req, res, next) {
        process.nextTick(function () {
            console.log("INSIDE THE FUNCTION WHERE ACCESSTOKEN IS SAVED -- \n"+ accessToken + '\n' + profile.id);
            //redclient.set(profile.id, accessToken);
            //next();
        });
        // asynchronous verification
        process.nextTick(function () {
            // To keep the example simple, the user's Cisco Spark profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Cisco Spark account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
            //return done(accessToken, profile);
        });
    }
));

//---------------------------------------------------------------------------


//---------------------------------------------------------------------------
// define SSL certificate options for HTTPS
//---------------------------------------------------------------------------
var sslOptions = {
    key: fs.readFileSync('bbp_com.key'),
    cert: fs.readFileSync ('72043468.crt')
};
//---------------------------------------------------------------------------

// configure Express

app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static("public"));

app.use(session({ secret: 'hachawla is a collab sales engineer', resave: false, saveUninitialized: false }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(__dirname + '/public'));

app.use(express.static(path));
//------------------------------------------------------
//app.use(express.static(path.join(__dirname, 'greyscale')));
/*
app.use('/vendor',  express.static(__dirname + '/' + process.env.TEMPLATE + '/vendor'));
app.use('/css',  express.static(__dirname + '/' + process.env.TEMPLATE + '/css'));
app.use('/js',  express.static(__dirname + '/' + process.env.TEMPLATE + '/js'));
app.use('/img',  express.static(__dirname + '/' + process.env.TEMPLATE + '/img'));
app.use('/less',  express.static(__dirname + '/' + process.env.TEMPLATE + '/less'));
app.use('/sass',  express.static(__dirname + '/' + process.env.TEMPLATE + '/sass'));
*/
app.set('view engine', 'ejs');

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  //res.sendFile(path + "index.html");
    res.render ('index-greyscale', { user: req.user });
    console.log (req.user);
});

router.get("/login",function(req,res){
    res.sendFile(path + "login.html");
    //res.render('login', { user: req.user });
});

router.get("/auth/spark",
    passport.authenticate('cisco-spark'),
    function(req,res){
    //res.sendFile(path + "login.html");
});

router.get("/auth/spark/callback",
    passport.authenticate('cisco-spark', {
        failureRedirect: '/login',
        successRedirect: '/'
    }));

router.get("/moderna",function(req,res){
    //res.sendFile(path2 + "index.html");
    res.render('index-moderna', { user: req.user });
});

router.get("/squadfree",function(req,res){
    res.sendFile(path2 + "index.html");
    //res.render('index-moderna', { user: req.user });
});

//*****************************************************************
// LOGIN PAGE
//*****************************************************************
/*
app.get('/login', function(req, res){
    res.render('login', { user: req.user });
    //res.redirect('/');
});
*/
//https://smsbot.cisco.com/auth/spark/callback
/*
//*****************************************************************
// AUTHENTICATION PAGE
//*****************************************************************
// GET /auth/spark
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Cisco Spark authentication will involve
//   redirecting the user to ciscospark.com (https://api.ciscospark.com/v1/authorize).  After authorization, Cisco Spark
//   will redirect the user back to this application at /auth/spark/callback
app.get('/auth/spark',
    passport.authenticate('cisco-spark'),
    function(req, res) {
        // The request will be redirected to Cisco Spark for authentication, so this
        // function will not be called.
    });


//*****************************************************************
// AUTH CALL BACK PAGE FOR IDBROKER
//*****************************************************************
// GET /auth/spark/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/spark/callback',
    passport.authenticate('cisco-spark', {
        failureRedirect: '/login',
        successRedirect: '/',
        //failureFlash: true
    }));
*/
//*****************************************************************
// LOGOUT PAGE
//*****************************************************************
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});



router.get("/about",function(req,res){
    res.write(process.env.HTTPS_PORT);
    res.write("this should be the About page");
    res.end();
  //res.sendFile(path + "about.html");
});

router.get("/contact", ensureAuthenticated, function(req,res){
    console.log(req.user);
    res.write(req.user.toString());
    //res.write("\n this should be the user page");
    res.end();
  //res.sendFile(path + "contact.html");
});



//*****************************************************************
// FUNCTION TO CHECK IF LOGGED IN USER IS AUTHENTICATED
//*****************************************************************
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//*****************************************************************
//CREATE A CUSTOMER FORM
//*****************************************************************
router.get('/addcustomer', ensureAuthenticated, function (req, res) {
    res.render('addcustomerform', {
        user: req.user,
        title: "Add new customer", //page title
        action: "/save", //post action for the form
        fields: [
            {label: 'Customer\'s name: ', name :'fullname',type:'text',property:'required'},   //first field for the form
            {label: 'Mobile number: ', name:'cellphone',type:'text',property:'required'}   //another field for the form
            //{name:'cellphone',type:'number',property:'required'},
            //{label: "I'd like to be the Spark Agent", name:'enroll-as-agent',type:'radio',property:'optional'},
        ]
    });
});

//------------------------------------------------------------------------

app.use("/",router);

app.use("*",function(req,res){
    res.sendFile(path + "404.html");
});
//---------------------------------------------------------------------------
// Start web server on HTTP and HTTPS ports defined in .env file
//---------------------------------------------------------------------------
https.createServer(sslOptions, app).listen(process.env.HTTPS_PORT, function(){
    console.log ('HTTPS Server started on port: ' + process.env.HTTPS_PORT);
});

http.createServer(function (req, res){
    //redirect to SSL site
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(process.env.HTTP_PORT, function(){
    console.log ('HTTP Server started on port: ' + process.env.HTTP_PORT);
});
//---------------------------------------------------------------------------
