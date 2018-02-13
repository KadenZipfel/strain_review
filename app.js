var express       = require("express"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Strain        = require("./models/strain"),
    seedDB        = require("./seeds"),
    Comment       = require("./models/comment"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user"),
    app           = express();
    
// Requiring routes
var commentRoutes = require("./routes/comments"),
    strainRoutes  = require("./routes/strains"),
    indexRoutes   = require("./routes/index");
    
mongoose.connect("mongodb://localhost/cannareviews");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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
  next();
});

app.use(indexRoutes);
app.use("/strains/:id/comments", commentRoutes);
app.use("/strains", strainRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running."); 
});