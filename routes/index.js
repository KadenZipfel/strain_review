var express  = require("express"),
    passport = require("passport"),
    User     = require("../models/user"),
    router   = express.Router();

// Landing Route
router.get("/", function(req, res){
  res.render("landing");
});

// Register form
router.get("/register", function(req, res){
  res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
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

// Login form
router.get("/login", function(res, res){
  res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/strains", 
  failureRedirect: "/login"
}), function(req, res){
  
});

// Logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/strains");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;