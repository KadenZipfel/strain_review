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
    
mongoose.connect("mongodb://localhost/cannareviews");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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
    
app.get("/", function(req, res){
  res.render("landing");
});

// Index Route
app.get("/strains", function(req, res){
  // Get all strains from DB
  Strain.find({}, function(err, allStrains){
    if(err){
      console.log(err);
    } else {
      res.render("strains/index", {strains:allStrains});
    }
  });
});

// Create Route
app.post("/strains", function(req, res){
  //Get data from form and add to strains array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newStrain = {name: name, image: image, description: desc};
  //Create a new strain and save to DB
  Strain.create(newStrain, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      //Redirect back to strains page
      res.redirect("/strains");
    }
  });
});

// New Route
app.get("/strains/new", function(req, res){
  res.render("strains/new");
});

// Show Route
app.get("/strains/:id", function(req, res){
  //Find the strain with provided ID
  Strain.findById(req.params.id).populate("comments").exec(function(err, foundStrain){
    if(err) {
      console.log(err);
    } else {
      console.log(foundStrain);
      //Render show template with that strain
      res.render("strains/show", {strain: foundStrain});
    }
  });
});

// ===============
// COMMENTS ROUTES
// ===============

app.get("/strains/:id/comments/new", function(req, res) {
  // Find strain by id
  Strain.findById(req.params.id, function(err, strain){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {strain: strain});
    }
  });
});

app.post("/strains/:id/comments", function(req, res){
  // Look up strain using ID
  Strain.findById(req.params.id, function(err, strain){
    if(err){
      console.log(err);
      res.redirect("/strains");
    } else {
      // Create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          strain.comments.push(comment._id);
          strain.save();
          res.redirect("/strains/" + strain._id);
        }
      });
      // Connect new comment to strain
      // Redirect to show page
    }
  });
});

// ===========
// Auth routes
// ===========

// Register form
app.get("/register", function(req, res){
  res.render("register");
});

// Handle sign up logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/strains");
    });
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running."); 
});