var express        = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    app            = express();
    
// Requiring routes
require('dotenv').config({encoding: 'base64'});

var commentRoutes = require("./routes/comments"),
    strainRoutes  = require("./routes/strains"),
    indexRoutes   = require("./routes/index");
    
// mongoose.connect("mongodb://localhost/cannareviews");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// Seed the DB
// seedDB();

// Passport config
app.use(require("express-session")({
  secret: "This is my secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/strains/:id/comments", commentRoutes);
app.use("/strains", strainRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running."); 
});
